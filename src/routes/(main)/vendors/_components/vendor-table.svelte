<script lang="ts">
	import { DataTableCheckbox, DataTableColumnHeader } from '@/components/ui/data-table';
	import { Input } from '@/components/ui/input';
	import * as Table from '@/components/ui/table';
	import type { Vendor } from '@/types';
	import { Render, Subscribe, createRender, createTable } from 'svelte-headless-table';
	import { addSelectedRows, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { readable } from 'svelte/store';
	import VendorActions from './vendor-actions.svelte';
	import VendorEmailCell from './vendor-email-cell.svelte';
	import VendorPhoneCell from './vendor-phone-cell.svelte';
	import VendorTagsCell from './vendor-tags-cell.svelte';
	import VendorWebsiteCell from './vendor-website-cell.svelte';

	export let vendors: Vendor[];

	const table = createTable(readable(vendors), {
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
			accessor: 'tags',
			header: 'Tags',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(VendorTagsCell, {
						tags: value,
					});
				}
				return value.toString() ?? '';
			},
		}),
		table.column({
			accessor: 'email',
			header: 'Email',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(VendorEmailCell, {
						email: value,
					});
				}
				return value ?? '';
			},
		}),
		table.column({
			accessor: 'mobile',
			header: 'Phone',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(VendorPhoneCell, {
						phone: value,
					});
				}
				return value ?? '';
			},
		}),
		table.column({
			accessor: 'website',
			header: 'Website',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(VendorWebsiteCell, {
						website: value,
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
					return createRender(VendorActions, {
						vendor: row.original,
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
