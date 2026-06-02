import { form, getRequestEvent, query } from '$app/server';
import { deleteByIdSchema } from '@/shared/schemas';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { z } from 'zod';
import { tenantSchema } from './schemas';
import type { Tenant } from './types';

export const getTenants = query<Tenant[]>(async () => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: tenants, error: tenantsError } = await supabase
		.from('tenants')
		.select('*, address:addresses(*)');

	if (tenantsError) {
		error(500, 'Error fetching tenants, please try again later.');
	}

	return tenants;
});

export const getTenant = query(z.number(), async (id): Promise<Tenant> => {
	const event = getRequestEvent();

	const { data: tenant, error: tenantError } = await event.locals.supabase
		.from('tenants')
		.select('*, address:addresses(*)')
		.eq('id', id)
		.single();

	if (tenantError) {
		error(500, 'Error fetching tenant, please try again later.');
	}

	return tenant;
});

export const upsertTenant = form(tenantSchema, async (data) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { address: addressData, ...tenantData } = data;

	let addressId = addressData.id;
	if (addressId) {
		const { error: addressError } = await supabase
			.from('addresses')
			.update(addressData)
			.eq('id', addressId);

		if (addressError) {
			setFlash({ type: 'error', message: addressError.message }, cookies);
			error(500, addressError.message);
		}
	} else {
		const { data: address, error: addressError } = await supabase
			.from('addresses')
			.insert(addressData)
			.select('id')
			.single();

		if (addressError) {
			setFlash({ type: 'error', message: addressError.message }, cookies);
			error(500, addressError.message);
		}

		addressId = address.id;
	}

	if (tenantData.id) {
		const { error: tenantError } = await supabase
			.from('tenants')
			.update({ ...tenantData, address_id: addressId })
			.eq('id', tenantData.id);

		if (tenantError) {
			setFlash({ type: 'error', message: tenantError.message }, cookies);
			error(500, tenantError.message);
		}

		setFlash({ type: 'success', message: 'Tenant updated successfully' }, cookies);
		getTenants().refresh();
		getTenant(tenantData.id).refresh();
	} else {
		const { error: tenantError } = await supabase
			.from('tenants')
			.insert({ ...tenantData, address_id: addressId });

		if (tenantError) {
			setFlash({ type: 'error', message: tenantError.message }, cookies);
			error(500, tenantError.message);
		}

		setFlash({ type: 'success', message: 'Tenant created successfully' }, cookies);
		getTenants().refresh();
	}
});

export const deleteTenant = form(deleteByIdSchema, async ({ id }) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('tenants').delete().eq('id', id);

	if (deleteError) {
		setFlash({ type: 'error', message: deleteError.message }, cookies);
		error(500, deleteError.message);
	}

	setFlash({ type: 'success', message: 'Tenant deleted successfully' }, cookies);
	getTenants().refresh();

	return redirect(302, '/tenants');
});
