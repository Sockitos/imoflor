<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { createSvelteTable, FlexRender } from '@/components/ui/data-table';
	import { Input } from '@/components/ui/input';
	import * as Table from '@/components/ui/table';
	import type { Fraction, FractionType } from '@/types/types';
	import { getCoreRowModel, getFilteredRowModel, getSortedRowModel } from '@tanstack/table-core';
	import { writable } from 'svelte/store';
	import { columns } from './fraction-columns';
	import { typeMap } from './fraction-type-map';

	interface Props {
		fractions: Fraction[];
	}

	let { fractions }: Props = $props();

	const data = $state(fractions);

	const globalFilter = writable('');

	const table = createSvelteTable({
		get data() {
			return data;
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

	const _typeOptions = Object.entries(typeMap).map(([value, { label, icon }]) => {
		return { value, label, icon };
	});

	const _counts = $derived(
		fractions.reduce(
			(counts, fraction) => {
				const type = fraction.type;
				if (type) {
					counts.type[type] = (counts.type[type] ?? 0) + 1;
				}
				return counts;
			},
			{
				type: {} as Record<FractionType, number>,
			}
		)
	);

	const _showReset = $derived(Object.values($globalFilter).some((v) => v.length > 0));
</script>

<div class="flex flex-col gap-y-4">
	<div class="flex flex-row items-center gap-x-2">
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
									<Button
										variant="ghost"
										onclick={() => header.column.toggleSorting()}
										class="data-[state=open]:bg-accent -ml-3 h-8"
									>
										<FlexRender
											content={header.column.columnDef.header}
											context={header.getContext()}
										/>
									</Button>
								{:else}
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
