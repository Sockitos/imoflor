<script lang="ts" generics="TCard extends { id: number; columnId: string }">
	import { Badge } from '@/shared/components/ui/badge';
	import { Button } from '@/shared/components/ui/button';
	import { GripVertical, Plus } from 'lucide-svelte';
	import { untrack } from 'svelte';
	import type { Snippet } from 'svelte';

	type KanbanColumn = {
		id: string;
		label: string;
	};

	let {
		columns,
		cards,
		card,
	}: {
		columns: KanbanColumn[];
		cards: TCard[];
		card: Snippet<[TCard]>;
	} = $props();

	let columnOrder = $state<string[]>(untrack(() => columns.map((c) => c.id)));
	let draggingColumnId = $state<string | null>(null);
	let dragOverColumnId = $state<string | null>(null);
	let dragOverColumnPosition = $state<'before' | 'after'>('before');

	let localCards = $state<TCard[]>(
		untrack(() => [...cards, ...cards.map((c) => ({ ...c, id: c.id + 1000 }))])
	);
	let draggingCardId = $state<number | null>(null);
	let dragOverCardId = $state<number | null>(null);
	let dragOverCardPosition = $state<'before' | 'after'>('before');

	let previewColumnOrder = $derived.by(() => {
		if (
			draggingColumnId === null ||
			dragOverColumnId === null ||
			dragOverColumnId === draggingColumnId
		) {
			return columnOrder;
		}

		const withoutDraggingColumn = columnOrder.filter((c) => c !== draggingColumnId);
		const underColumnIndex = withoutDraggingColumn.indexOf(dragOverColumnId);
		if (underColumnIndex === -1) return columnOrder;

		const insertIndex =
			dragOverColumnPosition === 'after' ? underColumnIndex + 1 : underColumnIndex;
		const result = [...withoutDraggingColumn];
		result.splice(insertIndex, 0, draggingColumnId);

		return result;
	});

	let previewCards = $derived.by(() => {
		if (draggingCardId === null) return localCards;

		const draggingItem = localCards.find((t) => t.id === draggingCardId);
		if (!draggingItem) return localCards;

		const withoutDraggingCard = localCards.filter((t) => t.id !== draggingCardId);

		const dragOverCardInColumn =
			dragOverCardId !== null &&
			localCards.find((t) => t.id === dragOverCardId)?.columnId === dragOverColumnId;

		if (dragOverCardId !== null && dragOverColumnId !== null && dragOverCardInColumn) {
			const updatedItem = { ...draggingItem, columnId: dragOverColumnId };

			const targetIndex = withoutDraggingCard.findIndex((t) => t.id === dragOverCardId);
			if (targetIndex === -1) return localCards;

			const insertIndex = dragOverCardPosition === 'after' ? targetIndex + 1 : targetIndex;
			const result = [...withoutDraggingCard];
			result.splice(insertIndex, 0, updatedItem);

			return result;
		} else if (dragOverColumnId !== null) {
			const updatedItem = { ...draggingItem, columnId: dragOverColumnId };

			let lastColIndex = -1;
			for (let i = 0; i < withoutDraggingCard.length; i++) {
				if (withoutDraggingCard[i].columnId === dragOverColumnId) lastColIndex = i;
			}

			const result = [...withoutDraggingCard];
			result.splice(lastColIndex + 1, 0, updatedItem);

			return result;
		}

		return localCards;
	});

	function columnCards(columnId: string): TCard[] {
		return previewCards.filter((t) => t.columnId === columnId);
	}

	function onColumnDragStart(e: DragEvent, columnId: string) {
		draggingColumnId = columnId;
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
	}

	function onColumnDragOver(e: DragEvent, columnId: string) {
		if (draggingColumnId === null) return;
		if (columnId === draggingColumnId) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		dragOverColumnId = columnId;

		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		dragOverColumnPosition = e.clientX < rect.left + rect.width / 2 ? 'before' : 'after';
	}

	function onColumnDropCardDragOver(e: DragEvent, columnId: string) {
		e.preventDefault();

		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		dragOverColumnId = columnId;
	}

	function onColumnDrop(e: DragEvent) {
		e.preventDefault();

		if (draggingCardId !== null) {
			localCards = [...previewCards];
		} else if (draggingColumnId !== null) {
			columnOrder = [...previewColumnOrder];
		}
	}

	function onColumnDragEnd() {
		draggingColumnId = null;
		draggingCardId = null;
		dragOverColumnId = null;
		dragOverCardId = null;
	}

	function onCardDragStart(e: DragEvent, cardId: number) {
		draggingCardId = cardId;
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
	}

	function onCardDragOver(e: DragEvent, cardId: number, targetColumn: string) {
		if (draggingColumnId !== null) return;
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

		localCards = [...previewCards];
	}

	function onCardDragEnd() {
		draggingCardId = null;
		draggingColumnId = null;
		dragOverColumnId = null;
		dragOverCardId = null;
	}
</script>

<div class="flex gap-4 overflow-x-auto">
	{#each previewColumnOrder as columnId, index (columnId)}
		{@const col = columns.find((c) => c.id === columnId)!}
		{@const colCards = columnCards(columnId)}
		{@const isColDragging = draggingColumnId === columnId}

		<div
			role="region"
			aria-label={`${col.label} column`}
			class="flex w-72 shrink-0 flex-col gap-4 rounded-lg border bg-muted/40 px-2 py-4
					{isColDragging ? 'opacity-40' : ''}
					"
			ondragover={(e) =>
				draggingColumnId !== null
					? onColumnDragOver(e, columnId)
					: onColumnDropCardDragOver(e, columnId)}
			ondrop={onColumnDrop}
		>
			<div class="flex flex-row">
				<div class="flex flex-1 flex-row items-center gap-2">
					<div
						role="button"
						aria-label="Drag to reorder column"
						tabindex={index}
						draggable="true"
						class="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
						ondragstart={(e) => onColumnDragStart(e, columnId)}
						ondragend={onColumnDragEnd}
					>
						<GripVertical class="h-4 w-4" />
					</div>
					<span class="text-sm font-semibold">{col.label}</span>
					<Badge variant="secondary" class="rounded-full px-2 py-0 text-xs">
						{colCards.length}
					</Badge>
				</div>

				<Button variant="outline" size="icon" aria-label="Add item to {col.label}" class="h-6 w-6">
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
						ondragend={onCardDragEnd}
						ondragover={(e) => onCardDragOver(e, item.id, columnId)}
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
				>
					<Plus class="h-4 w-4" />
					Add Task
				</Button>
			</div>
		</div>
	{/each}
</div>
