import { createTenantSchema, deleteTenantSchema, updateTenantSchema } from '@/schemas/tenant';
import { handleLoginRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const session = await event.locals.getSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getTenants() {
		const { data: tenants, error: tenantsError } = await event.locals.supabase
			.from('tenants')
			.select('*');

		if (tenantsError) {
			return error(500, 'Error fetching tenants, please try again later.');
		}
		return tenants;
	}

	return {
		tenants: await getTenants(),
		createForm: await superValidate(createTenantSchema, {
			id: 'create',
		}),
		updateForm: await superValidate(updateTenantSchema, {
			id: 'update',
		}),
		deleteForm: await superValidate(deleteTenantSchema, {
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

		const form = await superValidate(event.request, createTenantSchema, { id: 'create' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase.from('tenants').insert(form.data);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return redirect(302, '/tenants');
	},
	update: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, updateTenantSchema, { id: 'update' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('tenants')
			.update(form.data)
			.eq('id', form.data.id);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return redirect(302, '/tenants');
	},
	delete: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, deleteTenantSchema, { id: 'delete' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('tenants')
			.delete()
			.eq('id', form.data.id);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return redirect(302, '/tenants');
	},
};
