<script lang="ts">
	import { Button } from '@/shared/components/ui/button';
	import * as DropdownMenu from '@/shared/components/ui/dropdown-menu';
	import type { Column } from '@tanstack/table-core';
	import {
		ArrowDownWideNarrow,
		ArrowLeftToLine,
		ArrowRightToLine,
		ArrowUpNarrowWide,
		EllipsisVertical,
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

<div class="flex items-center justify-between gap-1">
	<span>{label}</span>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="ghost" size="icon" class="h-6 w-6 shrink-0" {...props}>
					<EllipsisVertical class="h-3.5 w-3.5" />
					<span class="sr-only">Column options</span>
				</Button>
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
</div>
