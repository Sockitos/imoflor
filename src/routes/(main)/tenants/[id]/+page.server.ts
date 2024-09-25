import { createTenantSchema, deleteTenantSchema } from '@/schemas/tenant';
import type { Movement, Tenant } from '@/types/types';
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

	async function getTenant(): Promise<Tenant> {
		const { data: tenant, error: tenantError } = await event.locals.supabase
			.from('tenants')
			.select('*')
			.eq('id', event.params.id)
			.single();

		if (tenantError) {
			return error(500, 'Error fetching tenant, please try again later.');
		}
		return tenant;
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

	const tenant = await getTenant();

	return {
		tenant: tenant,
		movements: await getMovements(tenant.tax_id_number),
		updateTenantForm: await superValidate(tenant, zod(createTenantSchema), {
			id: 'update-tenant',
		}),
		deleteTenantForm: await superValidate(zod(deleteTenantSchema), {
			id: 'delete-tenant',
		}),
	};
};

export const actions = {
	update: async (event) =>
		handleFormAction(event, createTenantSchema, 'update-tenant', async (event, userId, form) => {
			const { error } = await event.locals.supabase
				.from('tenants')
				.update(form.data)
				.eq('id', event.params.id);

			if (error) {
				setFlash({ type: 'error', message: error.message }, event.cookies);
				return fail(500, { message: error.message, form });
			}

			return { success: true, form };
		}),
	delete: async (event) =>
		handleFormAction(event, deleteTenantSchema, 'delete-tenant', async (event, userId, form) => {
			const { error } = await event.locals.supabase.from('tenants').delete().eq('id', form.data.id);

			if (error) {
				setFlash({ type: 'error', message: error.message }, event.cookies);
				return fail(500, { message: error.message, form });
			}

			return redirect(302, '/tenants');
		}),
};
