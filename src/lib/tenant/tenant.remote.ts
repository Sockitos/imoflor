import { form, getRequestEvent, query } from '$app/server';
import { deleteByIdSchema, deleteByIdsSchema } from '@/shared/schemas';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { tenantSchema } from './schemas';
import type { Tenant, TenantOption } from './types';

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
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: tenant, error: tenantError } = await supabase
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
	} = getRequestEvent();

	const { address: addressData, ...tenantData } = data;
	const { id: existingAddressId, ...addressFields } = addressData;

	let addressId = existingAddressId;
	if (addressId) {
		const { error: addressError } = await supabase
			.from('addresses')
			.update(addressFields)
			.eq('id', addressId);

		if (addressError) {
			error(500, addressError.message);
		}
	} else {
		const { data: address, error: addressError } = await supabase
			.from('addresses')
			.insert(addressFields)
			.select('id')
			.single();

		if (addressError) {
			error(500, addressError.message);
		}

		addressId = address.id;
	}

	if (tenantData.id) {
		const { id, ...fields } = tenantData;
		const { error: tenantError } = await supabase
			.from('tenants')
			.update({ ...fields, address_id: addressId })
			.eq('id', id);

		if (tenantError) {
			error(500, tenantError.message);
		}

		getTenants().refresh();
		getTenant(id).refresh();
	} else {
		const { id: _id, ...insertFields } = tenantData;
		const { error: tenantError } = await supabase
			.from('tenants')
			.insert({ ...insertFields, address_id: addressId });

		if (tenantError) {
			error(500, tenantError.message);
		}

		getTenants().refresh();
	}
});

export const deleteTenant = form(deleteByIdSchema, async ({ id }) => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('tenants').delete().eq('id', id);

	if (deleteError) {
		error(500, deleteError.message);
	}

	getTenants().refresh();

	return redirect(302, '/tenants');
});

export const getTenantOptions = query<TenantOption[]>(async () => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: tenants, error: tenantsError } = await supabase.from('tenants').select('id, name');

	if (tenantsError) {
		error(500, 'Error fetching tenants, please try again later.');
	}

	return tenants;
});

export const deleteTenants = form(deleteByIdsSchema, async ({ ids }) => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('tenants').delete().in('id', ids);

	if (deleteError) {
		error(500, deleteError.message);
	}

	getTenants().refresh();
});
