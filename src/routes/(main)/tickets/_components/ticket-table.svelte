<script lang="ts">
	import { Button } from '@/components/ui/button';
	import {
		DataTableCheckbox,
		DataTableColumnHeader,
		DataTableFilter,
	} from '@/components/ui/data-table';
	import { Input } from '@/components/ui/input';
	import * as Table from '@/components/ui/table';
	import type { Ticket, TicketPriority, TicketStatus } from '@/types';
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
	import TicketActions from './ticket-actions.svelte';
	import TicketPriorityCell from './ticket-priority-cell.svelte';
	import { priorityMap } from './ticket-priority-map';
	import TicketStatusCell from './ticket-status-cell.svelte';
	import { statusMap } from './ticket-status-map';

	export let tickets: Ticket[];

	const table = createTable(readable(tickets), {
		select: addSelectedRows<Ticket>(),
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
			accessor: 'status',
			header: 'Status',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(TicketStatusCell, {
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
			accessor: 'priority',
			header: 'Priority',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(TicketPriorityCell, {
						priority: value,
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
			accessor: 'title',
			header: 'Title',
		}),
		table.column({
			accessor: (t) => t.property?.label ?? '',
			header: 'Property',
		}),
		table.column({
			accessor: (t) => t.fraction?.label ?? '',
			header: 'Fraction',
		}),
		table.display({
			id: 'actions',
			header: () => {
				return '';
			},
			cell: ({ row }) => {
				if (row.isData() && row.original) {
					return createRender(TicketActions, {
						ticket: row.original,
					});
				}
				return '';
			},
		}),
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { filterValue } = pluginStates.filter;
	type TicketFilters = { status?: TicketStatus[]; priority?: TicketPriority[] };
	const { filterValues }: { filterValues: Writable<TicketFilters> } = pluginStates.colFilter;

	$: counts = tickets.reduce(
		(counts, ticket) => {
			const status = ticket.status;
			const priority = ticket.priority;
			if (status) {
				counts.status[status] = (counts.status[status] ?? 0) + 1;
			}
			if (priority) {
				counts.priority[priority] = (counts.priority[priority] ?? 0) + 1;
			}
			return counts;
		},
		{
			status: {} as Record<TicketStatus, number>,
			priority: {} as Record<TicketPriority, number>,
		}
	);

	const statusOptions = Object.entries(statusMap).map(([value, { label, icon }]) => {
		return { value, label, icon };
	});
	const priorityOptions = Object.entries(priorityMap).map(([value, { label, icon }]) => {
		return { value, label, icon };
	});

	$: showReset = Object.values($filterValues).some((v) => v.length > 0);
</script>

<div class="flex flex-col gap-y-4">
	<div class="flex flex-row items-center justify-between">
		<div class="flex flex-row items-center gap-x-2">
			<Input placeholder={'Search...'} bind:value={$filterValue} class="w-[150px] lg:w-[250px]" />
			<DataTableFilter
				bind:filterValues={$filterValues.status}
				counts={counts.status}
				title="Status"
				options={statusOptions}
			/>
			<DataTableFilter
				bind:filterValues={$filterValues.priority}
				counts={counts.priority}
				title="Priority"
				options={priorityOptions}
			/>
			{#if showReset}
				<Button
					on:click={() => {
						$filterValues.status = [];
						$filterValues.priority = [];
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
