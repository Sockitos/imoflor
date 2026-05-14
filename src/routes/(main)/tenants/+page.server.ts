import { handleFormAction } from '@shared/utils';
import { error, fail } from '@sveltejs/kit';
import { createTenantSchema, deleteTenantSchema } from '@tenant/schemas';
import type { Tenant } from '@tenant/types';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	async function getTenants(): Promise<Tenant[]> {
		const { data: tenants, error: tenantsError } = await event.locals.supabase
			.from('tenants')
			.select('*, address:addresses(*)');

		if (tenantsError) {
			return error(500, 'Error fetching tenants, please try again later.');
		}
		return tenants;
	}

	return {
		tenants: await getTenants(),
		createTenantForm: await superValidate(zod4(createTenantSchema), {
			id: 'create-tenant',
		}),
		deleteTenantForm: await superValidate(zod4(deleteTenantSchema), {
			id: 'delete-tenant',
		}),
	};
};

export const actions = {
	create: async (event) =>
		handleFormAction(event, createTenantSchema, 'create-tenant', async (event, userId, form) => {
			const { address: addressData, ...tenantData } = form.data;

			const { data: address, error: addressError } = await event.locals.supabase
				.from('addresses')
				.insert(addressData)
				.select('id')
				.single();

			if (addressError) {
				setFlash({ type: 'error', message: addressError.message }, event.cookies);
				return fail(500, { message: addressError.message, form });
			}

			const { error } = await event.locals.supabase
				.from('tenants')
				.insert({ ...tenantData, address_id: address?.id });

			if (error) {
				setFlash({ type: 'error', message: error.message }, event.cookies);
				return fail(500, { message: error.message, form });
			}

			return { success: true, form };
		}),
};
