<script lang="ts" generics="TItem extends { id: string | number; columnId: string }">
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
		items,
		card,
		onAddItem,
	}: {
		columns: KanbanColumn[];
		items: TItem[];
		card: Snippet<[TItem]>;
		onAddItem?: (columnId: string) => void;
	} = $props();

	let columnOrder = $state<string[]>(untrack(() => columns.map((c) => c.id)));
	let localItems = $state<TItem[]>(untrack(() => [...items]));

	let draggingCardId = $state<string | number | null>(null);
	let draggingColumnId = $state<string | null>(null);
	let dragOverColumnId = $state<string | null>(null);
	let dragOverCardId = $state<string | number | null>(null);
	let dragOverPosition = $state<'before' | 'after'>('before');
	let dragOverColumnPosition = $state<'before' | 'after'>('before');

	let previewColumnOrder = $derived.by(() => {
		if (
			draggingColumnId === null ||
			dragOverColumnId === null ||
			dragOverColumnId === draggingColumnId
		) {
			return columnOrder;
		}
		const without = columnOrder.filter((c) => c !== draggingColumnId);
		const targetIdx = without.indexOf(dragOverColumnId);
		if (targetIdx === -1) return columnOrder;
		const insertIdx = dragOverColumnPosition === 'after' ? targetIdx + 1 : targetIdx;
		const result = [...without];
		result.splice(insertIdx, 0, draggingColumnId);
		return result;
	});

	let previewItems = $derived.by(() => {
		if (draggingCardId === null) return localItems;

		const draggingItem = localItems.find((t) => t.id === draggingCardId);
		if (!draggingItem) return localItems;

		const withoutDragging = localItems.filter((t) => t.id !== draggingCardId);

		const dragOverCardInColumn =
			dragOverCardId !== null &&
			localItems.find((t) => t.id === dragOverCardId)?.columnId === dragOverColumnId;

		if (dragOverCardId !== null && dragOverColumnId !== null && dragOverCardInColumn) {
			const updatedItem = { ...draggingItem, columnId: dragOverColumnId };
			const targetIndex = withoutDragging.findIndex((t) => t.id === dragOverCardId);
			if (targetIndex === -1) return localItems;
			const insertIndex = dragOverPosition === 'after' ? targetIndex + 1 : targetIndex;
			const result = [...withoutDragging];
			result.splice(insertIndex, 0, updatedItem);
			return result;
		} else if (dragOverColumnId !== null) {
			const updatedItem = { ...draggingItem, columnId: dragOverColumnId };
			let lastColIndex = -1;
			for (let i = 0; i < withoutDragging.length; i++) {
				if (withoutDragging[i].columnId === dragOverColumnId) lastColIndex = i;
			}
			const result = [...withoutDragging];
			result.splice(lastColIndex + 1, 0, updatedItem);
			return result;
		}

		return localItems;
	});

	function itemsForColumn(columnId: string): TItem[] {
		return previewItems.filter((t) => t.columnId === columnId);
	}

	function onCardDragStart(e: DragEvent, cardId: string | number, sourceColumn: string) {
		draggingCardId = cardId;
		draggingColumnId = null;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('type', 'card');
			e.dataTransfer.setData('cardId', String(cardId));
			e.dataTransfer.setData('sourceColumn', sourceColumn);
		}
	}

	function onCardDragEnd() {
		draggingCardId = null;
		draggingColumnId = null;
		dragOverColumnId = null;
		dragOverCardId = null;
	}

	function onCardDragOver(e: DragEvent, cardId: string | number, targetColumn: string) {
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
		dragOverPosition = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
	}

	function onCardDrop(e: DragEvent, targetCardId: string | number, targetColumn: string) {
		e.preventDefault();
		e.stopPropagation();
		if (!e.dataTransfer) return;
		const type = e.dataTransfer.getData('type');
		if (type !== 'card') return;

		localItems = [...previewItems];

		draggingCardId = null;
		dragOverCardId = null;
		dragOverColumnId = null;
	}

	function onColumnDropZoneDragOver(e: DragEvent, columnId: string) {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		dragOverColumnId = columnId;
	}

	function onColumnDropZoneDrop(e: DragEvent, targetColumn: string) {
		e.preventDefault();
		if (!e.dataTransfer) return;
		const type = e.dataTransfer.getData('type');

		if (type === 'card') {
			localItems = [...previewItems];
		} else if (type === 'column') {
			columnOrder = [...previewColumnOrder];
		}

		draggingCardId = null;
		draggingColumnId = null;
		dragOverColumnId = null;
		dragOverCardId = null;
	}

	function onColumnHandleDragStart(e: DragEvent, columnId: string) {
		draggingColumnId = columnId;
		draggingCardId = null;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('type', 'column');
			e.dataTransfer.setData('columnId', columnId);
		}
	}

	function onColumnHandleDragEnd() {
		draggingColumnId = null;
		draggingCardId = null;
		dragOverColumnId = null;
		dragOverCardId = null;
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
</script>

<div class="flex gap-4 overflow-x-auto pb-4">
	{#each previewColumnOrder as columnId, index (columnId)}
		{@const col = columns.find((c) => c.id === columnId)}
		{#if col}
			{@const colItems = itemsForColumn(columnId)}
			{@const isColDragging = draggingColumnId === columnId}

			<div
				role="region"
				aria-label={`${col.label} column`}
				class="flex w-72 shrink-0 flex-col rounded-lg border bg-muted/40 transition-opacity
					{isColDragging ? 'opacity-40' : ''}
					"
				ondragover={(e) => {
					if (draggingColumnId !== null) {
						onColumnDragOver(e, columnId);
					} else {
						onColumnDropZoneDragOver(e, columnId);
					}
				}}
				ondrop={(e) => onColumnDropZoneDrop(e, columnId)}
			>
				<!-- Column Header -->
				<div class="flex items-center gap-1.5 px-3 py-3">
					<div
						role="button"
						aria-label="Drag to reorder column"
						tabindex={index}
						draggable="true"
						class="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
						ondragstart={(e) => onColumnHandleDragStart(e, columnId)}
						ondragend={onColumnHandleDragEnd}
					>
						<GripVertical class="h-4 w-4" />
					</div>
					<span class="text-sm font-semibold">{col.label}</span>
					<Badge variant="secondary" class="rounded-full px-2 py-0 text-xs">
						{colItems.length}
					</Badge>

					<div class="ml-auto flex items-center gap-1">
						<Button
							variant="outline"
							size="icon"
							aria-label="Add item to {col.label}"
							class="h-6 w-6"
							onclick={() => onAddItem?.(columnId)}
						>
							<Plus class="h-3.5 w-3.5" />
						</Button>
					</div>
				</div>

				<!-- Cards list -->
				<div class="flex flex-1 flex-col gap-2 px-2 pb-2">
					{#each colItems as item (item.id)}
						{@const isDragging = draggingCardId === item.id}

						<div
							role="region"
							aria-label={`Card ${item.id}`}
							draggable="true"
							class="transition-opacity {isDragging ? 'opacity-30' : ''}"
							ondragstart={(e) => onCardDragStart(e, item.id, columnId)}
							ondragend={onCardDragEnd}
							ondragover={(e) => onCardDragOver(e, item.id, columnId)}
							ondrop={(e) => onCardDrop(e, item.id, columnId)}
						>
							{@render card(item)}
						</div>
					{/each}

					{#if colItems.length === 0}
						<div
							class="flex flex-col items-center gap-2 rounded-md border border-dashed px-4 py-6 text-center"
						>
							<p class="text-xs text-muted-foreground">No tasks here.</p>
						</div>
					{/if}

					<Button
						variant="ghost"
						class="mt-1 w-full justify-start text-muted-foreground hover:text-foreground"
						onclick={() => onAddItem?.(columnId)}
					>
						<Plus class="mr-2 h-4 w-4" />
						Add Task
					</Button>
				</div>
			</div>
		{/if}
	{/each}
</div>
