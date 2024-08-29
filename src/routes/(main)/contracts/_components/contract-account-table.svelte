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
	import type { ContractAccountItem, ContractAccountType } from '@/types/types';
	import dayjs from 'dayjs';
	import { Cross2 } from 'radix-icons-svelte';
	import { Render, Subscribe, createRender, createTable } from 'svelte-headless-table';
	import {
		addColumnFilters,
		addSelectedRows,
		addSortBy,
		addTableFilter,
	} from 'svelte-headless-table/plugins';
	import { writable, type Writable } from 'svelte/store';
	import ContractAccountActions from './contract-account-actions.svelte';
	import ContractAccountTypeCell from './contract-account-type-cell.svelte';
	import { typeMap } from './contract-account-type-map';

	export let contractAccount: ContractAccountItem[];
	let data = writable(contractAccount);
	$: data.set(contractAccount);

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
			accessor: 'type',
			header: 'Type',
			cell: ({ value, row }) => {
				return createRender(ContractAccountTypeCell, {
					type: value,
				});
			},
		}),
		table.column({
			accessor: 'value',
			header: 'Value',
			cell: ({ value }) => {
				const formatted = currencyFormatter.format(value);
				return formatted;
			},
		}),
		table.display({
			id: 'actions',
			header: () => {
				return '';
			},
			cell: ({ row }) => {
				if (row.isData() && row.original) {
					return createRender(ContractAccountActions, {});
				}
				return '';
			},
		}),
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { filterValue } = pluginStates.filter;
	type ContractAccountFilters = { type?: ContractAccountType[] };
	const { filterValues }: { filterValues: Writable<ContractAccountFilters> } =
		pluginStates.colFilter;

	const typeOptions = Object.entries(typeMap).map(([value, { label, icon }]) => {
		return { value, label, icon };
	});

	$: counts = contractAccount.reduce(
		(counts, item) => {
			const type = item.type;
			if (type) {
				counts.type[type] = (counts.type[type] ?? 0) + 1;
			}
			return counts;
		},
		{
			type: {} as Record<ContractAccountType, number>,
		}
	);

	$: showReset = Object.values($filterValues).some((v) => {
		if (Array.isArray(v)) {
			return v.length > 0;
		} else {
			return v !== false;
		}
	});
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
				>
					Reset
					<Cross2 class="ml-2 h-4 w-4" />
				</Button>
			{/if}
		</div>
		<div class="flex flex-row gap-x-2">
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
