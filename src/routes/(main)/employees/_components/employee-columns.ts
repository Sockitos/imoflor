import { renderComponent } from '@/components/ui/data-table';
import DataTableCheckbox from '@/components/ui/data-table/data-table-checkbox.svelte';
import type { Employee } from '@/types/types';
import type { ColumnDef } from '@tanstack/table-core';
import EmployeeActions from './employee-actions.svelte';
import EmployeeEmailCell from './employee-email-cell.svelte';
import EmployeePhoneCell from './employee-phone-cell.svelte';
import EmployeeSalaryCell from './employee-salary-cell.svelte';

export const columns: ColumnDef<Employee>[] = [
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
		accessorKey: 'position',
		header: 'Position',
	},
	{
		accessorKey: 'salary',
		header: 'Salary',
		cell: ({ row }) => {
			return renderComponent(EmployeeSalaryCell, {
				type: row.original.salary_type,
				salary: row.original.salary,
			});
		},
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => {
			return renderComponent(EmployeeEmailCell, {
				email: row.original.email,
			});
		},
	},
	{
		accessorKey: 'phone',
		header: 'Phone',
		cell: ({ row }) => {
			return renderComponent(EmployeePhoneCell, {
				phone: row.original.phone,
			});
		},
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => {
			return renderComponent(EmployeeActions, {
				employee: row.original,
			});
		},
	},
];
