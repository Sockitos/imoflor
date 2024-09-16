import { createEmployeeSchema, deleteEmployeeSchema } from '@/schemas/employee';
import type { Employee, Movement } from '@/types/types';
import { handleLoginRedirect } from '@/utils';
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
		const { data: contractAccount, error: contractAccountError } = await event.locals.supabase
			.from('movements')
			.select('*')
			.eq('tax_id_number', tax_id_number);

		if (contractAccountError) {
			return error(500, 'Error fetching movements, please try again later.');
		}
		return contractAccount;
	}

	const employee = await getEmployee();

	return {
		employee: employee,
		movements: await getMovements(employee.tax_id_number),
		updateForm: await superValidate(employee, zod(createEmployeeSchema), {
			id: 'update',
		}),
		deleteForm: await superValidate(zod(deleteEmployeeSchema), {
			id: 'delete',
		}),
	};
};

export const actions = {
	update: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(createEmployeeSchema), { id: 'update' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('employees')
			.update(form.data)
			.eq('id', event.params.id);

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return { success: true, form };
	},
	delete: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(deleteEmployeeSchema), { id: 'delete' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('employees')
			.delete()
			.eq('id', form.data.id);

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return { success: true, form };
	},
};
