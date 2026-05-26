<script lang="ts" generics="TCard extends { id: number; columnId: string; rank: string }">
	import type { Snippet } from 'svelte';
	import KanbanCard from './kanban-card.svelte';
	import KanbanColumn from './kanban-column.svelte';
	import type { ColumnCards, KanbanColumnDef } from './types';

	let {
		columns,
		cards,
		card,
		onAddCard,
		onMoveCard,
	}: {
		columns: KanbanColumnDef[];
		cards: TCard[];
		card: Snippet<[TCard]>;
		onAddCard?: (columnId: string) => void;
		onMoveCard?: (
			cardId: number,
			columnId: string,
			upperRank: string | undefined,
			bottomRank: string | undefined
		) => void;
	} = $props();

	function sortByRank(items: TCard[]): TCard[] {
		return items.toSorted((a, b) => {
			if (a.rank < b.rank) return -1;
			if (a.rank > b.rank) return 1;
			return 0;
		});
	}

	function groupByColumn(cardsList: TCard[], columnIds: string[]): ColumnCards<TCard> {
		const grouped = Object.fromEntries(
			columnIds.map((id) => [id, [] as TCard[]])
		) as ColumnCards<TCard>;

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

	function cloneColumnCards(grouped: ColumnCards<TCard>): ColumnCards<TCard> {
		return Object.fromEntries(
			Object.entries(grouped).map(([columnId, columnCards]) => [columnId, [...columnCards]])
		) as ColumnCards<TCard>;
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

	let previewColumnCards = $derived.by((): ColumnCards<TCard> => {
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

		<KanbanColumn
			column={col}
			cardCount={colCards.length}
			{onAddCard}
			onColumnDragOver={(e) => onColumnDragOver(e, col.id)}
			{onColumnDrop}
		>
			{#each colCards as item (item.id)}
				<KanbanCard
					itemId={item.id}
					isDragging={draggingCardId === item.id}
					onDragStart={(e) => onCardDragStart(e, item.id)}
					onDragOver={(e) => onCardDragOver(e, item.id, col.id)}
					onDrop={onCardDrop}
					{onDragEnd}
				>
					{@render card(item)}
				</KanbanCard>
			{/each}
		</KanbanColumn>
	{/each}
</div>
