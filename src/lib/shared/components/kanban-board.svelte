<script lang="ts" generics="TCard extends { id: number; columnId: string; rank: string }">
	import { Badge } from '@/shared/components/ui/badge';
	import { Button } from '@/shared/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	type KanbanColumn = {
		id: string;
		label: string;
	};

	type ColumnCards = Record<string, TCard[]>;

	let {
		columns,
		cards,
		card,
		onAddCard,
		onMoveCard,
	}: {
		columns: KanbanColumn[];
		cards: TCard[];
		card: Snippet<[TCard]>;
		onAddCard?: (columnId: string) => void;
		onMoveCard?: (
			cardId: number,
			columnId: string,
			rank1: string | undefined,
			rank2: string | undefined
		) => void;
	} = $props();

	function sortByRank(items: TCard[]): TCard[] {
		return items.toSorted((a, b) => {
			if (a.rank < b.rank) return -1;
			if (a.rank > b.rank) return 1;
			return 0;
		});
	}

	function groupByColumn(cardsList: TCard[], columnIds: string[]): ColumnCards {
		const grouped = Object.fromEntries(columnIds.map((id) => [id, [] as TCard[]])) as ColumnCards;

		for (const item of cardsList) {
			if (grouped[item.columnId]) {
				grouped[item.columnId].push(item);
			}
		}

		for (const columnId of columnIds) {
			grouped[columnId] = sortByRank(grouped[columnId]);
		}

		return grouped;
	}

	function cloneColumnCards(grouped: ColumnCards): ColumnCards {
		return Object.fromEntries(
			Object.entries(grouped).map(([columnId, columnCards]) => [columnId, [...columnCards]])
		) as ColumnCards;
	}

	function insertIndexForDrop(
		targetColumn: TCard[],
		dragOverCardId: number | null,
		dragOverCardInColumn: boolean,
		dragOverCardPosition: 'before' | 'after'
	): number {
		if (dragOverCardId !== null && dragOverCardInColumn) {
			const targetIndex = targetColumn.findIndex((t) => t.id === dragOverCardId);
			if (targetIndex === -1) return targetColumn.length;

			return dragOverCardPosition === 'after' ? targetIndex + 1 : targetIndex;
		}

		return targetColumn.length;
	}

	const columnIds = $derived(columns.map((c) => c.id));

	let dragOverColumnId = $state<string | null>(null);
	let draggingCardId = $state<number | null>(null);
	let dragOverCardId = $state<number | null>(null);
	let dragOverCardPosition = $state<'before' | 'after'>('before');

	let columnCardsByColumn = $derived(groupByColumn(cards, columnIds));

	let previewColumnCards = $derived.by((): ColumnCards => {
		if (draggingCardId === null || dragOverColumnId === null) {
			return columnCardsByColumn;
		}

		const draggingItem = cards.find((t) => t.id === draggingCardId);
		if (!draggingItem) return columnCardsByColumn;

		const targetColumn = columnCardsByColumn[dragOverColumnId] ?? [];
		const targetWithoutDragging = targetColumn.filter((t) => t.id !== draggingCardId);
		const dragOverCardInColumn =
			dragOverCardId !== null &&
			cards.find((t) => t.id === dragOverCardId)?.columnId === dragOverColumnId;

		const shouldPreviewMove = dragOverCardInColumn || targetWithoutDragging.length === 0;
		if (!shouldPreviewMove) return columnCardsByColumn;

		const grouped = cloneColumnCards(columnCardsByColumn);
		const sourceColumn = grouped[draggingItem.columnId];
		if (!sourceColumn) return columnCardsByColumn;

		const sourceIndex = sourceColumn.findIndex((t) => t.id === draggingCardId);
		if (sourceIndex === -1) return columnCardsByColumn;

		const [removed] = sourceColumn.splice(sourceIndex, 1);
		const movingCard = { ...removed, columnId: dragOverColumnId };

		const insertIndex = insertIndexForDrop(
			targetWithoutDragging,
			dragOverCardId,
			dragOverCardInColumn,
			dragOverCardPosition
		);

		const updatedTargetColumn = [...targetWithoutDragging];
		updatedTargetColumn.splice(insertIndex, 0, movingCard);
		grouped[dragOverColumnId] = updatedTargetColumn;

		return grouped;
	});

	function columnCards(columnId: string): TCard[] {
		return previewColumnCards[columnId] ?? [];
	}

	function onColumnDragOver(e: DragEvent, columnId: string) {
		e.preventDefault();

		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

		if (dragOverColumnId !== columnId) dragOverCardId = null;

		dragOverColumnId = columnId;
	}

	function commitCardMove() {
		if (draggingCardId === null || dragOverColumnId === null) return;

		const originalCard = cards.find((c) => c.id === draggingCardId);
		if (!originalCard) return;

		const targetColumn = (columnCardsByColumn[dragOverColumnId] ?? []).filter(
			(c) => c.id !== draggingCardId
		);
		const dragOverCardInColumn =
			dragOverCardId !== null &&
			cards.find((t) => t.id === dragOverCardId)?.columnId === dragOverColumnId;

		const insertIndex = insertIndexForDrop(
			targetColumn,
			dragOverCardId,
			dragOverCardInColumn,
			dragOverCardPosition
		);

		const originalColumn = columnCardsByColumn[originalCard.columnId] ?? [];
		const originalIndexInColumn = originalColumn.findIndex((c) => c.id === draggingCardId);

		const previousCardRank = targetColumn[insertIndex - 1]?.rank;
		const nextCardRank = targetColumn[insertIndex]?.rank;

		const columnChanged = originalCard.columnId !== dragOverColumnId;
		const positionChanged =
			!columnChanged &&
			originalCard.columnId === dragOverColumnId &&
			originalIndexInColumn !== insertIndex;

		if (columnChanged || positionChanged) {
			onMoveCard?.(draggingCardId, dragOverColumnId, previousCardRank, nextCardRank);
		}
	}

	function onColumnDrop(e: DragEvent) {
		e.preventDefault();
		commitCardMove();
	}

	function onCardDragStart(e: DragEvent, cardId: number) {
		draggingCardId = cardId;
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
	}

	function onCardDragOver(e: DragEvent, cardId: number, targetColumn: string) {
		if (cardId === draggingCardId) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		dragOverCardId = cardId;
		dragOverColumnId = targetColumn;

		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		dragOverCardPosition = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
	}

	function onCardDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();

		commitCardMove();
	}

	function onDragEnd() {
		draggingCardId = null;
		dragOverColumnId = null;
		dragOverCardId = null;
	}
</script>

<div class="flex gap-4 overflow-x-auto">
	{#each columns as col (col.id)}
		{@const colCards = columnCards(col.id)}

		<div
			role="region"
			aria-label={`${col.label} column`}
			class="flex w-72 shrink-0 flex-col gap-4 rounded-lg border bg-muted/40 px-2 py-4"
			ondragover={(e) => onColumnDragOver(e, col.id)}
			ondrop={onColumnDrop}
		>
			<div class="flex flex-row">
				<div class="flex flex-1 flex-row items-center gap-2">
					<span class="text-sm font-semibold">{col.label}</span>
					<Badge variant="secondary" class="rounded-full px-2 py-0 text-xs">
						{colCards.length}
					</Badge>
				</div>

				<Button
					variant="outline"
					size="icon"
					aria-label="Add item to {col.label}"
					class="h-6 w-6"
					onclick={() => onAddCard?.(col.id)}
				>
					<Plus class="h-3.5 w-3.5" />
				</Button>
			</div>

			<div class="flex flex-1 flex-col gap-3">
				{#each colCards as item (item.id)}
					{@const isDragging = draggingCardId === item.id}

					<div
						role="region"
						aria-label={`Card ${item.id}`}
						draggable="true"
						class="transition-opacity {isDragging ? 'opacity-30' : ''}"
						ondragstart={(e) => onCardDragStart(e, item.id)}
						ondragend={onDragEnd}
						ondragover={(e) => onCardDragOver(e, item.id, col.id)}
						ondrop={onCardDrop}
					>
						{@render card(item)}
					</div>
				{/each}

				{#if colCards.length === 0}
					<div class="flex flex-col items-center rounded-md border border-dashed py-8 text-center">
						<p class="text-xs text-muted-foreground">No tasks here.</p>
					</div>
				{/if}

				<Button
					variant="ghost"
					class="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
					onclick={() => onAddCard?.(col.id)}
				>
					<Plus class="h-4 w-4" />
					Add Task
				</Button>
			</div>
		</div>
	{/each}
</div>
