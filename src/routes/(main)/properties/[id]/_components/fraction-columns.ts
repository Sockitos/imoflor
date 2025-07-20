import { renderComponent } from '@/components/ui/data-table';
import DataTableCheckbox from '@/components/ui/data-table/data-table-checkbox.svelte';
import { currencyFormatter } from '@/formatters';
import type { Fraction } from '@/types/types';
import type { ColumnDef } from '@tanstack/table-core';
import FractionActions from './fraction-actions.svelte';
import FractionTypeCell from './fraction-type-cell.svelte';

export const columns: ColumnDef<Fraction>[] = [
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
			return renderComponent(FractionTypeCell, {
				type: row.original.type,
			});
		},
		filterFn: (row, id, filterValue: string[]) => {
			if (filterValue.length === 0) return true;
			return filterValue.includes(row.getValue(id));
		},
	},
	{
		accessorKey: 'matrix',
		header: 'Matrix',
	},
	{
		accessorKey: 'address',
		header: 'Address',
	},
	{
		accessorKey: 'patrimonial_value',
		header: 'Patrimonial Value',
		cell: ({ row }) => {
			const value = row.original.patrimonial_value ?? 0;
			return currencyFormatter.format(value);
		},
	},
	{
		accessorKey: 'market_value',
		header: 'Market Value',
		cell: ({ row }) => {
			const value = row.original.market_value ?? 0;
			return currencyFormatter.format(value);
		},
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => {
			return renderComponent(FractionActions, {
				fraction: row.original,
			});
		},
	},
];
