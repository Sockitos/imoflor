<script lang="ts">
	import { createSvelteTable, FlexRender } from '@/shared/components/ui/data-table';
	import { Button } from '@/shared/components/ui/button';
	import { Input } from '@/shared/components/ui/input';
	import * as Table from '@/shared/components/ui/table';
	import { getCoreRowModel, getFilteredRowModel, getSortedRowModel } from '@tanstack/table-core';
	import { Trash2 } from 'lucide-svelte';
	import type { Fraction } from '../types';
	import { columns } from './fraction-columns';
	import FractionBulkDeleteDialog from './fraction-bulk-delete-dialog.svelte';

	interface Props {
		fractions: Fraction[];
		parentId: number;
	}

	let { fractions, parentId }: Props = $props();

	let globalFilter = $state('');
	let rowSelection = $state<Record<string, boolean>>({});
	let openBulkDelete = $state(false);

	const table = createSvelteTable({
		get data() {
			return fractions;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onGlobalFilterChange: (value) => (globalFilter = value),
		onRowSelectionChange: (updater) => {
			rowSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
		},
		state: {
			get globalFilter() {
				return globalFilter;
			},
			get rowSelection() {
				return rowSelection;
			},
		},
	});

	const selectedFractionIds = $derived(
		table.getSelectedRowModel().rows.map((row) => row.original.id)
	);
</script>

<div class="flex flex-col gap-y-4">
	<div class="flex flex-row items-center justify-between gap-x-2">
		<Input placeholder="Search..." bind:value={globalFilter} class="w-[150px] lg:w-[250px]" />
		{#if selectedFractionIds.length}
			<Button variant="destructive" size="sm" onclick={() => (openBulkDelete = true)}>
				<Trash2 class="mr-2 h-4 w-4" />
				Delete ({selectedFractionIds.length})
			</Button>
		{/if}
	</div>
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<FractionBulkDeleteDialog
	bind:open={openBulkDelete}
	fractionIds={selectedFractionIds}
	{parentId}
	onSuccess={() => table.toggleAllPageRowsSelected(false)}
/>
