import { renderComponent } from '@/shared/components/ui/data-table';
import DataTableCheckbox from '@/shared/components/ui/data-table/data-table-checkbox.svelte';
import type { ColumnDef } from '@tanstack/table-core';
import type { Tenant } from '../types';
import TenantActions from './tenant-actions.svelte';
import TenantColumnHeader from './tenant-column-header.svelte';
import TenantEmailCell from './tenant-email-cell.svelte';
import TenantPhoneCell from './tenant-phone-cell.svelte';

export const columns: ColumnDef<Tenant>[] = [
	{
		id: 'select',
		size: 48,
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
		header: ({ column }) => renderComponent(TenantColumnHeader, { label: 'Name', column }),
	},
	{
		accessorKey: 'email',
		header: ({ column }) => renderComponent(TenantColumnHeader, { label: 'Email', column }),
		cell: ({ row }) => {
			return renderComponent(TenantEmailCell, {
				email: row.original.email,
			});
		},
	},
	{
		accessorKey: 'phone',
		header: ({ column }) => renderComponent(TenantColumnHeader, { label: 'Phone', column }),
		cell: ({ row }) => {
			return renderComponent(TenantPhoneCell, {
				phone: row.original.phone,
			});
		},
	},
	{
		accessorKey: 'actions',
		size: 48,
		header: '',
		cell: ({ row }) => {
			return renderComponent(TenantActions, {
				tenant: row.original,
			});
		},
	},
];
