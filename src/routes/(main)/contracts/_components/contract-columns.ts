import { renderComponent } from '@/components/ui/data-table';
import DataTableCheckbox from '@/components/ui/data-table/data-table-checkbox.svelte';
import { currencyFormatter } from '@/formatters';
import type { Contract, ContractType } from '@/types/types';
import type { ColumnDef } from '@tanstack/table-core';
import ContractActions from './contract-actions.svelte';
import ContractBalanceCell from './contract-balance-cell.svelte';
import ContractTypeCell from './contract-type-cell.svelte';

export const columns: ColumnDef<Contract>[] = [
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
		accessorKey: 'type',
		header: 'Type',
		cell: ({ row }) => {
			return renderComponent(ContractTypeCell, {
				type: row.original.type,
			});
		},
		filterFn: (row, id, filterValue: ContractType[]) => {
			if (filterValue.length === 0) return true;
			return filterValue.includes(row.getValue(id));
		},
	},
	{
		accessorFn: (row) => row.fraction.label,
		id: 'fraction',
		header: 'Fraction',
	},
	{
		accessorKey: 'tenants',
		header: 'Tenants',
		cell: ({ row }) => {
			const tenants = row.original.tenants;
			const count = tenants.length;
			if (count === 0) return '';
			return count === 1 ? tenants[0].label : `${tenants[0].label} +${count - 1}`;
		},
	},
	{
		accessorFn: (row) => {
			if (row.type === 'renting') {
				return row.data.rent;
			}
			return row.data.installment;
		},
		id: 'payment',
		header: 'Payment',
		cell: ({ row }) => {
			const contract = row.original;
			const value = contract.type === 'renting' ? contract.data.rent : contract.data.installment;
			return currencyFormatter.format(value);
		},
	},
	{
		accessorKey: 'balance',
		header: 'Balance',
		cell: ({ row }) => {
			return renderComponent(ContractBalanceCell, {
				balance: row.original.balance,
			});
		},
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => {
			return renderComponent(ContractActions, {
				contract: row.original,
			});
		},
	},
];
