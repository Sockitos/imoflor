import {
	createEmployeeSchema,
	deleteEmployeeSchema,
	updateEmployeeSchema,
} from '@/schemas/employee';
import { handleLoginRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const session = await event.locals.getSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getEmployees() {
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
		createForm: await superValidate(createEmployeeSchema, {
			id: 'create',
		}),
		updateForm: await superValidate(updateEmployeeSchema, {
			id: 'update',
		}),
		deleteForm: await superValidate(deleteEmployeeSchema, {
			id: 'delete',
		}),
	};
};

export const actions = {
	create: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, createEmployeeSchema, { id: 'create' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('employees')
			.insert(form.data);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return redirect(302, '/employees');
	},
	update: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, updateEmployeeSchema, { id: 'update' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('employees')
			.update(form.data)
			.eq('id', form.data.id);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return redirect(302, '/employees');
	},
	delete: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, deleteEmployeeSchema, { id: 'delete' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('employees')
			.delete()
			.eq('id', form.data.id);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return redirect(302, '/employees');
	},
};
