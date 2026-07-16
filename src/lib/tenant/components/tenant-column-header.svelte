<script lang="ts">
	import * as DropdownMenu from '@/shared/components/ui/dropdown-menu';
	import type { Column } from '@tanstack/table-core';
	import {
		ArrowDownWideNarrow,
		ArrowLeftToLine,
		ArrowRightToLine,
		ArrowUpNarrowWide,
		PinOff,
		X,
	} from 'lucide-svelte';

	interface Props {
		label: string;
		column: Column<any, any>;
	}

	let { label, column }: Props = $props();

	const pinned = $derived(column.getIsPinned());
	const sorted = $derived(column.getIsSorted());
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
		<div
			role="button"
			tabindex="0"
			class="flex w-full cursor-pointer items-center gap-1.5 select-none"
			{...props}
		>
			{label}
			{#if sorted === 'asc'}
				<ArrowUpNarrowWide class="h-3.5 w-3.5 shrink-0" />
			{:else if sorted === 'desc'}
				<ArrowDownWideNarrow class="h-3.5 w-3.5 shrink-0" />
			{/if}
		</div>
		{/snippet}
	</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			{#if sorted === 'asc'}
				<DropdownMenu.Item onclick={() => column.clearSorting()}>
					<X class="mr-2 h-4 w-4" />
					Unsort
				</DropdownMenu.Item>
			{:else}
				<DropdownMenu.Item onclick={() => column.toggleSorting(false)}>
					<ArrowUpNarrowWide class="mr-2 h-4 w-4" />
					Sort ascending
				</DropdownMenu.Item>
			{/if}
			{#if sorted === 'desc'}
				<DropdownMenu.Item onclick={() => column.clearSorting()}>
					<X class="mr-2 h-4 w-4" />
					Unsort
				</DropdownMenu.Item>
			{:else}
				<DropdownMenu.Item onclick={() => column.toggleSorting(true)}>
					<ArrowDownWideNarrow class="mr-2 h-4 w-4" />
					Sort descending
				</DropdownMenu.Item>
			{/if}
			<DropdownMenu.Separator />
			{#if pinned === 'left'}
				<DropdownMenu.Item onclick={() => column.pin(false)}>
					<PinOff class="mr-2 h-4 w-4" />
					Unpin
				</DropdownMenu.Item>
			{:else}
				<DropdownMenu.Item onclick={() => column.pin('left')}>
					<ArrowLeftToLine class="mr-2 h-4 w-4" />
					Pin to left
				</DropdownMenu.Item>
			{/if}
			{#if pinned === 'right'}
				<DropdownMenu.Item onclick={() => column.pin(false)}>
					<PinOff class="mr-2 h-4 w-4" />
					Unpin
				</DropdownMenu.Item>
			{:else}
				<DropdownMenu.Item onclick={() => column.pin('right')}>
					<ArrowRightToLine class="mr-2 h-4 w-4" />
					Pin to right
				</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Content>
</DropdownMenu.Root>
