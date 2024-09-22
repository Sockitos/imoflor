import { createEmployeeSchema, deleteEmployeeSchema } from '@/schemas/employee';
import type { Employee, Movement } from '@/types/types';
import { handleFormAction, handleLoginRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getEmployee(): Promise<Employee> {
		const { data: employee, error: employeeError } = await event.locals.supabase
			.from('employees')
			.select('*')
			.eq('id', event.params.id)
			.single();

		if (employeeError) {
			return error(500, 'Error fetching employee, please try again later.');
		}
		return employee;
	}

	async function getMovements(tax_id_number: string): Promise<Movement[]> {
		const { data: movements, error: movementsError } = await event.locals.supabase
			.from('movements')
			.select('*')
			.eq('tax_id_number', tax_id_number);

		if (movementsError) {
			return error(500, 'Error fetching movements, please try again later.');
		}
		return movements;
	}

	const employee = await getEmployee();

	return {
		employee: employee,
		movements: await getMovements(employee.tax_id_number),
		updateEmployeeForm: await superValidate(employee, zod(createEmployeeSchema), {
			id: 'update-employee',
		}),
		deleteEmployeeForm: await superValidate(zod(deleteEmployeeSchema), {
			id: 'delete-employee',
		}),
	};
};

export const actions = {
	update: async (event) =>
		handleFormAction(
			event,
			createEmployeeSchema,
			'update-employee',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase
					.from('employees')
					.update(form.data)
					.eq('id', event.params.id);

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
	delete: async (event) =>
		handleFormAction(
			event,
			deleteEmployeeSchema,
			'delete-employee',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase
					.from('employees')
					.delete()
					.eq('id', form.data.id);

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
};
