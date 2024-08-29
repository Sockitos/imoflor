<script lang="ts">
	import { DataTableCheckbox, DataTableColumnHeader } from '@/components/ui/data-table';
	import { Input } from '@/components/ui/input';
	import * as Table from '@/components/ui/table';
	import type { Employee } from '@/types/types';
	import { Render, Subscribe, createRender, createTable } from 'svelte-headless-table';
	import { addSelectedRows, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { writable } from 'svelte/store';
	import EmployeeActions from './employee-actions.svelte';
	import EmployeeEmailCell from './employee-email-cell.svelte';
	import EmployeePhoneCell from './employee-phone-cell.svelte';
	import EmployeeSalaryCell from './employee-salary-cell.svelte';

	export let employees: Employee[];
	let data = writable(employees);
	$: data.set(employees);

	const table = createTable(data, {
		select: addSelectedRows(),
		sort: addSortBy({
			toggleOrder: ['asc', 'desc'],
		}),
		filter: addTableFilter<string>(),
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
			accessor: 'name',
			header: 'Name',
		}),
		table.column({
			accessor: 'position',
			header: 'Position',
		}),
		table.column({
			accessor: 'salary',
			header: 'Salary',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(EmployeeSalaryCell, {
						type: row.original.salary_type,
						salary: value,
					});
				}
				return value ?? '';
			},
		}),
		table.column({
			accessor: 'email',
			header: 'Email',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(EmployeeEmailCell, {
						email: value,
					});
				}
				return value ?? '';
			},
		}),
		table.column({
			accessor: 'phone',
			header: 'Phone',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(EmployeePhoneCell, {
						phone: value,
					});
				}
				return value ?? '';
			},
		}),
		table.display({
			id: 'actions',
			header: () => {
				return '';
			},
			cell: ({ row }) => {
				if (row.isData() && row.original) {
					return createRender(EmployeeActions, {
						employee: row.original,
					});
				}
				return '';
			},
		}),
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { filterValue } = pluginStates.filter;
</script>

<div class="flex flex-col gap-y-4">
	<div class="flex flex-row items-center justify-between">
		<div class="flex flex-row items-center">
			<Input placeholder={'Search...'} bind:value={$filterValue} class="w-[150px] lg:w-[250px]" />
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
