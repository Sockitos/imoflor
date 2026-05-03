import { renderComponent } from '@/components/ui/data-table';
import DataTableCheckbox from '@/components/ui/data-table/data-table-checkbox.svelte';
import { currencyFormatter } from '@/formatters';
import type { ContractAccountItem, ContractAccountType } from '@/types/types';
import type { ColumnDef } from '@tanstack/table-core';
import dayjs from 'dayjs';
import ContractAccountActions from './contract-account-actions.svelte';
import ContractAccountTypeCell from './contract-account-type-cell.svelte';

export const columns: ColumnDef<ContractAccountItem>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(DataTableCheckbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all',
			}),
		cell: ({ row }) =>
			renderComponent(DataTableCheckbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				'aria-label': 'Select row',
			}),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'date',
		header: 'Date',
		cell: ({ row }) => dayjs(row.original.date).format('DD/MM/YYYY'),
	},
	{
		accessorKey: 'type',
		header: 'Type',
		cell: ({ row }) => {
			return renderComponent(ContractAccountTypeCell, {
				type: row.original.type,
			});
		},
		filterFn: (row, id, filterValue: ContractAccountType[]) => {
			if (filterValue.length === 0) return true;
			return filterValue.includes(row.getValue(id));
		},
	},
	{
		accessorKey: 'value',
		header: 'Value',
		cell: ({ row }) => {
			return currencyFormatter.format(row.original.value);
		},
	},
	{
		id: 'actions',
		header: '',
		cell: () => {
			return renderComponent(ContractAccountActions, {});
		},
	},
];
