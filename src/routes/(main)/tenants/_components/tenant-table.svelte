<script lang="ts">
	import { createSvelteTable, FlexRender } from '@/components/ui/data-table';
	import { Input } from '@/components/ui/input';
	import * as Table from '@/components/ui/table';
	import type { Tenant } from '@/types/types';
	import { getCoreRowModel, getFilteredRowModel, getSortedRowModel } from '@tanstack/table-core';
	import { writable } from 'svelte/store';
	import { columns } from './tenant-columns';

	interface Props {
		tenants: Tenant[];
	}

	let { tenants }: Props = $props();

	const globalFilter = writable('');

	const table = createSvelteTable({
		get data() {
			return tenants;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onGlobalFilterChange: globalFilter.set,
		state: {
			get globalFilter() {
				return $globalFilter;
			},
		},
	});
</script>

<div class="flex flex-col gap-y-4">
	<div class="flex flex-row items-center">
		<Input placeholder="Search..." bind:value={$globalFilter} class="w-[150px] lg:w-[250px]" />
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
