import { renderComponent } from '@/components/ui/data-table';
import DataTableCheckbox from '@/components/ui/data-table/data-table-checkbox.svelte';
import type { Tenant } from '@/types/tenant';
import type { ColumnDef } from '@tanstack/table-core';
import TenantActions from './tenant-actions.svelte';
import TenantEmailCell from './tenant-email-cell.svelte';
import TenantPhoneCell from './tenant-phone-cell.svelte';

export const columns: ColumnDef<Tenant>[] = [
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
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => {
			return renderComponent(TenantEmailCell, {
				email: row.original.email,
			});
		},
	},
	{
		accessorKey: 'phone',
		header: 'Phone',
		cell: ({ row }) => {
			return renderComponent(TenantPhoneCell, {
				phone: row.original.phone,
			});
		},
	},
	{
		accessorKey: 'actions',
		header: '',
		cell: ({ row }) => {
			return renderComponent(TenantActions, {
				tenant: row.original,
			});
		},
	},
];
