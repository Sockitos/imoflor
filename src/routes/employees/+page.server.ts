import { createEmployeeSchema, deleteEmployeeSchema } from '@/schemas/employee';
import type { Employee } from '@/types/types';
import { handleFormAction } from '@/utils';
import { error, fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	async function getEmployees(): Promise<Employee[]> {
		const { data: employees, error: employeesError } = await event.locals.supabase
			.from('employees')
			.select('*');

		if (employeesError) {
			return error(500, 'Error fetching employees, please try again later.');
		}
		return employees;
	}

	return {
		employees: await getEmployees(),
		createEmployeeForm: await superValidate(zod4(createEmployeeSchema), {
			id: 'create-employee',
		}),
		deleteEmployeeForm: await superValidate(zod4(deleteEmployeeSchema), {
			id: 'delete-employee',
		}),
	};
};

export const actions = {
	create: async (event) =>
		handleFormAction(
			event,
			createEmployeeSchema,
			'create-employee',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase.from('employees').insert(form.data);

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
};
