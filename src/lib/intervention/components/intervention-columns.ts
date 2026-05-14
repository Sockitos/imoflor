import { renderComponent } from '@shared/components/ui/data-table';
import DataTableCheckbox from '@shared/components/ui/data-table/data-table-checkbox.svelte';
import type { ColumnDef } from '@tanstack/table-core';
import type { Intervention, InterventionStatus, InterventionType } from '../types';
import InterventionActions from './intervention-actions.svelte';
import InterventionStatusCell from './intervention-status-cell.svelte';
import InterventionTypeCell from './intervention-type-cell.svelte';

export const columns: ColumnDef<Intervention>[] = [
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
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'type',
		header: 'Type',
		cell: ({ row }) => {
			return renderComponent(InterventionTypeCell, {
				type: row.original.type,
			});
		},
		filterFn: (row, id, filterValue: InterventionType[]) => {
			if (filterValue.length === 0) return true;
			return filterValue.includes(row.getValue(id));
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			return renderComponent(InterventionStatusCell, {
				status: row.original.status,
			});
		},
		filterFn: (row, id, filterValue: InterventionStatus[]) => {
			if (filterValue.length === 0) return true;
			return filterValue.includes(row.getValue(id));
		},
	},
	{
		accessorKey: 'start_date',
		header: 'Start Date',
	},
	{
		accessorKey: 'end_date',
		header: 'End Date',
	},
	{
		accessorFn: (row) => row.ticket?.label ?? '',
		id: 'ticket',
		header: 'Ticket',
	},
	{
		accessorFn: (row) => row.property?.label ?? '',
		id: 'property',
		header: 'Property',
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => {
			return renderComponent(InterventionActions, {
				intervention: row.original,
			});
		},
	},
];
