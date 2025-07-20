import { renderComponent } from '@/components/ui/data-table';
import DataTableCheckbox from '@/components/ui/data-table/data-table-checkbox.svelte';
import { currencyFormatter } from '@/formatters';
import type { Movement } from '@/types/types';
import type { ColumnDef } from '@tanstack/table-core';
import dayjs from 'dayjs';
import MovementActions from './movement-actions.svelte';
import MovementTypeCell from './movement-type-cell.svelte';

export const columns: ColumnDef<Movement>[] = [
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
		cell: ({ row }) => {
			return dayjs(row.original.date).format('DD/MM/YYYY');
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
		accessorKey: 'type',
		header: 'Type',
		cell: ({ row }) => {
			return renderComponent(MovementTypeCell, {
				type: row.original.type,
			});
		},
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'actions',
		header: '',
		cell: ({ row }) => {
			return renderComponent(MovementActions, {
				movement: row.original,
			});
		},
		enableSorting: false,
	},
];
