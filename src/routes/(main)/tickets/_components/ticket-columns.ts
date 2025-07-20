import { renderComponent } from '@/components/ui/data-table';
import DataTableCheckbox from '@/components/ui/data-table/data-table-checkbox.svelte';
import type { Ticket, TicketPriority, TicketStatus } from '@/types/types';
import type { ColumnDef } from '@tanstack/table-core';
import TicketActions from './ticket-actions.svelte';
import TicketPriorityCell from './ticket-priority-cell.svelte';
import TicketStatusCell from './ticket-status-cell.svelte';

export const columns: ColumnDef<Ticket>[] = [
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
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			return renderComponent(TicketStatusCell, {
				status: row.original.status,
			});
		},
		filterFn: (row, id, filterValue: TicketStatus[]) => {
			if (filterValue.length === 0) return true;
			return filterValue.includes(row.getValue(id));
		},
	},
	{
		accessorKey: 'priority',
		header: 'Priority',
		cell: ({ row }) => {
			return renderComponent(TicketPriorityCell, {
				priority: row.original.priority,
			});
		},
		filterFn: (row, id, filterValue: TicketPriority[]) => {
			if (filterValue.length === 0) return true;
			return filterValue.includes(row.getValue(id));
		},
	},
	{
		accessorKey: 'title',
		header: 'Title',
	},
	{
		accessorFn: (row) => row.property?.label ?? '',
		id: 'property',
		header: 'Property',
	},
	{
		accessorFn: (row) => row.fraction?.label ?? '',
		id: 'fraction',
		header: 'Fraction',
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => {
			return renderComponent(TicketActions, {
				ticket: row.original,
			});
		},
	},
];
