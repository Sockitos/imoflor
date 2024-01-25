<script lang="ts">
	import { Button } from '@/components/ui/button';
	import {
		DataTableCheckbox,
		DataTableColumnHeader,
		DataTableFilter,
	} from '@/components/ui/data-table';
	import { Input } from '@/components/ui/input';
	import * as Table from '@/components/ui/table';
	import type { Intervention, InterventionStatus, InterventionType } from '@/types';
	import { Cross2 } from 'radix-icons-svelte';
	import { Render, Subscribe, createRender, createTable } from 'svelte-headless-table';
	import {
		addColumnFilters,
		addSelectedRows,
		addSortBy,
		addTableFilter,
	} from 'svelte-headless-table/plugins';
	import type { Writable } from 'svelte/store';
	import { get, readable } from 'svelte/store';
	import InterventionActions from './intervention-actions.svelte';
	import InterventionStatusCell from './intervention-status-cell.svelte';
	import { statusMap } from './intervention-status-map';
	import InterventionTypeCell from './intervention-type-cell.svelte';
	import { typeMap } from './intervention-type-map';

	export let interventions: Intervention[];

	const table = createTable(readable(interventions), {
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
			accessor: 'id',
			header: 'ID',
		}),
		table.column({
			accessor: 'type',
			header: 'Type',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(InterventionTypeCell, {
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
			accessor: 'status',
			header: 'Status',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(InterventionStatusCell, {
						status: value,
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
			accessor: 'start_date',
			header: 'Start Date',
		}),
		table.column({
			accessor: 'end_date',
			header: 'End Date',
		}),
		table.column({
			accessor: (i) => i.ticket?.label ?? '',
			header: 'Ticket',
		}),
		table.column({
			accessor: (i) => i.property?.label ?? '',
			header: 'Property',
		}),
		table.column({
			accessor: (i) => i.fraction?.label ?? '',
			header: 'Fraction',
		}),
		table.display({
			id: 'actions',
			header: () => {
				return '';
			},
			cell: ({ row }) => {
				if (row.isData() && row.original) {
					return createRender(InterventionActions, {
						intervention: row.original,
					});
				}
				return '';
			},
		}),
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { filterValue } = pluginStates.filter;
	type InterventionFilters = { type?: InterventionType[]; status?: InterventionStatus[] };
	const { filterValues }: { filterValues: Writable<InterventionFilters> } = pluginStates.colFilter;

	$: counts = interventions.reduce(
		(counts, intervention) => {
			const type = intervention.type;
			const status = intervention.status;
			if (type) {
				counts.type[type] = (counts.type[type] ?? 0) + 1;
			}
			if (status) {
				counts.status[status] = (counts.status[status] ?? 0) + 1;
			}
			return counts;
		},
		{
			type: {} as Record<InterventionType, number>,
			status: {} as Record<InterventionStatus, number>,
		}
	);

	const typeOptions = Object.entries(typeMap).map(([value, { label, icon }]) => {
		return { value, label, icon };
	});

	const statusOptions = Object.entries(statusMap).map(([value, { label, icon }]) => {
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
			<DataTableFilter
				bind:filterValues={$filterValues.type}
				counts={counts.status}
				title="Status"
				options={statusOptions}
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
		<div>
			<slot />
		</div>
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
