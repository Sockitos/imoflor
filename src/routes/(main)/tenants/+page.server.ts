import { createTenantSchema, deleteTenantSchema } from '@/schemas/tenant';
import type { Tenant } from '@/types/types';
import { handleFormAction, handleLoginRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getTenants(): Promise<Tenant[]> {
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
		createTenantForm: await superValidate(zod(createTenantSchema), {
			id: 'create-tenant',
		}),
		deleteTenantForm: await superValidate(zod(deleteTenantSchema), {
			id: 'delete-tenant',
		}),
	};
};

export const actions = {
	create: async (event) =>
		handleFormAction(event, createTenantSchema, 'create-tenant', async (event, userId, form) => {
			const { error } = await event.locals.supabase.from('tenants').insert(form.data);

			if (error) {
				setFlash({ type: 'error', message: error.message }, event.cookies);
				return fail(500, { message: error.message, form });
			}

			return { success: true, form };
		}),
};
