<script lang="ts">
	import { Button } from '@/components/ui/button';
	import {
		DataTableCheckbox,
		DataTableColumnHeader,
		DataTableFilter,
	} from '@/components/ui/data-table';
	import { Input } from '@/components/ui/input';
	import * as Table from '@/components/ui/table';
	import { currencyFormatter } from '@/formatters';
	import type { Movement, MovementType } from '@/types/types';
	import dayjs from 'dayjs';
	import { PlusCircle } from 'lucide-svelte';
	import { Cross2 } from 'radix-icons-svelte';
	import { Render, Subscribe, createRender, createTable } from 'svelte-headless-table';
	import {
		addColumnFilters,
		addSelectedRows,
		addSortBy,
		addTableFilter,
	} from 'svelte-headless-table/plugins';
	import { get, writable, type Writable } from 'svelte/store';
	import MovementActions from './movement-actions.svelte';
	import MovementTypeCell from './movement-type-cell.svelte';
	import { typeMap } from './movement-type-map';

	export let movements: Movement[];
	let data = writable(movements);
	$: data.set(movements);

	const table = createTable(data, {
		select: addSelectedRows(),
		sort: addSortBy({
			toggleOrder: ['asc', 'desc'],
		}),
		filter: addTableFilter<string>(),
		colFilter: addColumnFilters(),
	});

	const columns = table.createColumns([
		table.display({
			id: 'select',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected,
					'aria-label': 'Select all',
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);
				return createRender(DataTableCheckbox, {
					checked: isSelected,
					'aria-label': 'Select row',
					class: 'translate-y-[2px]',
				});
			},
			plugins: {
				sort: {
					disable: true,
				},
			},
		}),
		table.column({
			accessor: 'date',
			header: 'Date',
			cell: ({ value }) => dayjs(value).format('DD/MM/YYYY'),
		}),
		table.column({
			accessor: 'value',
			header: 'Value',
			cell: ({ value }) => {
				const formatted = currencyFormatter.format(value);
				return formatted;
			},
		}),
		table.column({
			accessor: 'type',
			header: 'Type',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(MovementTypeCell, {
						type: value,
					});
				}
				return value ?? '';
			},
			plugins: {
				colFilter: {
					fn: ({ filterValue, value }) => {
						if (filterValue.length === 0) return true;
						if (!Array.isArray(filterValue) || typeof value !== 'string') return true;
						return filterValue.some((filter) => {
							return value.includes(filter);
						});
					},
					initialFilterValue: [],
					render: ({ filterValue }) => {
						return get(filterValue);
					},
				},
			},
		}),
		table.column({
			accessor: 'description',
			header: 'Description',
		}),
		table.display({
			id: 'actions',
			header: () => {
				return '';
			},
			cell: ({ row }) => {
				if (row.isData() && row.original) {
					return createRender(MovementActions, {});
				}
				return '';
			},
		}),
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { filterValue } = pluginStates.filter;
	type MovementFilters = { type?: MovementType[] };
	const { filterValues }: { filterValues: Writable<MovementFilters> } = pluginStates.colFilter;

	$: counts = movements.reduce(
		(counts, movement) => {
			const type = movement.type;
			if (type) {
				counts.type[type] = (counts.type[type] ?? 0) + 1;
			}
			return counts;
		},
		{
			type: {} as Record<MovementType, number>,
		}
	);

	const typeOptions = Object.entries(typeMap).map(([value, { label, icon }]) => {
		return { value, label, icon };
	});

	$: showReset = Object.values($filterValues).some((v) => v.length > 0);
</script>

<div class="flex flex-col gap-y-4">
	<div class="flex flex-row items-center justify-between">
		<div class="flex flex-row items-center gap-x-2">
			<Input placeholder={'Search...'} bind:value={$filterValue} class="w-[150px] lg:w-[250px]" />
			<DataTableFilter
				bind:filterValues={$filterValues.type}
				counts={counts.type}
				title="Type"
				options={typeOptions}
			/>
			{#if showReset}
				<Button
					on:click={() => {
						$filterValues.type = [];
					}}
					variant="ghost"
					size="sm"
				>
					Reset
					<Cross2 class="ml-2 h-4 w-4" />
				</Button>
			{/if}
		</div>
		<Button>
			<PlusCircle class="mr-2 h-4 w-4" />
			Movement
		</Button>
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs}>
										{#if cell.id !== 'select' && cell.id !== 'actions'}
											<DataTableColumnHeader {props}>
												<Render of={cell.render()} />
											</DataTableColumnHeader>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										<Render of={cell.render()} />
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
