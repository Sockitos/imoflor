<script lang="ts">
	import { Badge } from '@/shared/components/ui/badge';
	import { Button } from '@/shared/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type { KanbanColumnDef } from './types';

	let {
		column,
		cardCount,
		children,
		onAddCard,
		onColumnDragOver,
		onColumnDrop,
	}: {
		column: KanbanColumnDef;
		cardCount: number;
		children: Snippet;
		onAddCard?: (columnId: string) => void;
		onColumnDragOver: (e: DragEvent) => void;
		onColumnDrop: (e: DragEvent) => void;
	} = $props();

	function handleAddCard() {
		onAddCard?.(column.id);
	}
</script>

<div
	role="region"
	aria-label={`${column.label} column`}
	class="flex w-78 shrink-0 flex-col gap-4 rounded-lg border bg-muted/40"
	ondragover={onColumnDragOver}
	ondrop={onColumnDrop}
>
	<div class="flex flex-row px-2 pt-4">
		<div class="flex flex-1 flex-row items-center gap-2">
			<span class="text-sm font-semibold">{column.label}</span>
			<Badge variant="secondary" class="rounded-full px-2 py-0 text-xs">
				{cardCount}
			</Badge>
		</div>

		<Button
			variant="outline"
			size="icon-xs"
			aria-label="Add item to {column.label}"
			onclick={handleAddCard}
		>
			<Plus />
		</Button>
	</div>

	<div class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-2 pb-4">
		{@render children()}

		{#if cardCount === 0}
			<div class="flex flex-col items-center rounded-md border border-dashed py-8 text-center">
				<p class="text-xs text-muted-foreground">No tasks here.</p>
			</div>
		{/if}
	</div>
</div>
