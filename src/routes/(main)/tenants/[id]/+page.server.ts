import type { Movement } from '@movement/types';
import { handleFormAction } from '@shared/utils';
import { error, redirect } from '@sveltejs/kit';
import { deleteTenantSchema, updateTenantSchema } from '@tenant/schemas';
import type { Tenant } from '@tenant/types';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	async function getTenant(): Promise<Tenant> {
		const { data: tenant, error: tenantError } = await event.locals.supabase
			.from('tenants')
			.select('*, address:addresses(*)')
			.eq('id', Number(event.params.id))
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
		updateTenantForm: await superValidate(tenant, zod4(updateTenantSchema), {
			id: 'update-tenant',
		}),
		deleteTenantForm: await superValidate(
			{ id: Number(event.params.id) },
			zod4(deleteTenantSchema),
			{
				id: 'delete-tenant',
			}
		),
	};
};

export const actions = {
	update: async (event) =>
		handleFormAction(event, updateTenantSchema, 'update-tenant', async (event, userId, form) => {
			const { address: addressData, ...tenantData } = form.data;
			const { id: addressId, ...addressFields } = addressData;

			if (addressId) {
				const { error: addressError } = await event.locals.supabase
					.from('addresses')
					.update(addressFields)
					.eq('id', addressId);

				if (addressError) {
					setFlash({ type: 'error', message: addressError.message }, event.cookies);
					return fail(500, { message: addressError.message, form });
				}
			} else {
				const { data: address, error: addressError } = await event.locals.supabase
					.from('addresses')
					.insert(addressFields)
					.select('id')
					.single();

				if (addressError) {
					setFlash({ type: 'error', message: addressError.message }, event.cookies);
					return fail(500, { message: addressError.message, form });
				}

				Object.assign(tenantData, { address_id: address?.id });
			}

			const { error } = await event.locals.supabase
				.from('tenants')
				.update(tenantData)
				.eq('id', Number(event.params.id));

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
