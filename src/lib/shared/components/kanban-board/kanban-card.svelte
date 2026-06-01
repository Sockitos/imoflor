<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		itemId,
		isDragging,
		children,
		onDragStart,
		onDragOver,
		onDrop,
		onDragEnd,
	}: {
		itemId: number;
		isDragging: boolean;
		children: Snippet;
		onDragStart: (e: DragEvent) => void;
		onDragOver: (e: DragEvent) => void;
		onDrop: (e: DragEvent) => void;
		onDragEnd: () => void;
	} = $props();
</script>

<div
	role="region"
	aria-label={`Card ${itemId}`}
	draggable="true"
	class="transition-opacity {isDragging ? 'opacity-30' : ''}"
	ondragstart={onDragStart}
	ondragend={onDragEnd}
	ondragover={onDragOver}
	ondrop={onDrop}
>
	{@render children()}
</div>
