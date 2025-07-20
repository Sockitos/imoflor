import { renderComponent } from '@/components/ui/data-table';
import DataTableCheckbox from '@/components/ui/data-table/data-table-checkbox.svelte';
import type { Vendor } from '@/types/types';
import type { ColumnDef } from '@tanstack/table-core';
import VendorActions from './vendor-actions.svelte';
import VendorEmailCell from './vendor-email-cell.svelte';
import VendorPhoneCell from './vendor-phone-cell.svelte';
import VendorTagsCell from './vendor-tags-cell.svelte';
import VendorWebsiteCell from './vendor-website-cell.svelte';

export const columns: ColumnDef<Vendor>[] = [
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
		accessorKey: 'tags',
		header: 'Tags',
		cell: ({ row }) => {
			return renderComponent(VendorTagsCell, {
				tags: row.original.tags,
			});
		},
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => {
			return renderComponent(VendorEmailCell, {
				email: row.original.email,
			});
		},
	},
	{
		accessorKey: 'mobile',
		header: 'Phone',
		cell: ({ row }) => {
			return renderComponent(VendorPhoneCell, {
				phone: row.original.mobile,
			});
		},
	},
	{
		accessorKey: 'website',
		header: 'Website',
		cell: ({ row }) => {
			return renderComponent(VendorWebsiteCell, {
				website: row.original.website,
			});
		},
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => {
			return renderComponent(VendorActions, {
				vendor: row.original,
			});
		},
	},
];
