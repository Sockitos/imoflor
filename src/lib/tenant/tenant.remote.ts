import { form, getRequestEvent, query } from '$app/server';
import { error, fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { deleteTenantSchema } from './schemas';
import { setFlash } from 'sveltekit-flash-message/server';
import type { Tenant } from './types';
import { addressSchema, genderSchema, maritalStatusSchema } from '@/shared/schemas';

const createTenantSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	gender: genderSchema,
	marital_status: maritalStatusSchema,
	nationality: z.string().min(1, 'Nationality is required'),
	birth_date: z.string().optional(),
	id_type: z.string().min(1, 'ID Type is required'),
	id_expiration_date: z.string().optional(),
	id_number: z.string().min(1, 'ID Number is required'),
	tax_id_number: z.string().min(1, 'Tax ID Number is required'),
	address: addressSchema,
	email: z.string().optional(),
	mobile: z.string().optional(),
	phone: z.string().optional(),
});

export const getTenants = query<Tenant[]>(async () => {
	const { locals: { supabase } } = getRequestEvent();

	const { data: tenants, error: tenantsError } = await supabase
		.from('tenants')
		.select('*, address:addresses(*)');

	if (tenantsError) {
		return error(500, 'Error fetching tenants, please try again later.');
	}
	return tenants;
});

export const createTenant = form(createTenantSchema, async (data) => {
	const { locals: { supabase }, cookies } = getRequestEvent();

	const { address: addressData, ...tenantData } = data;

	const { data: address, error: addressError } = await supabase
		.from('addresses')
		.insert(addressData)
		.select('id')
		.single();

	if (addressError) {
		setFlash({ type: 'error', message: addressError.message }, cookies);
		return fail(500, { message: addressError.message, form });
	}

	const { error } = await supabase
		.from('tenants')
		.insert({ ...tenantData, address_id: address?.id });

	if (error) {
		setFlash({ type: 'error', message: error.message }, cookies);
		return fail(500, { message: error.message, form });
	}

	getTenants().refresh();
});

export const deleteTenant = form(deleteTenantSchema, async ({ id }) => {
	const { locals: { supabase }, cookies } = getRequestEvent();

	const { error } = await supabase.from('tenants').delete().eq('id', id);

	if (error) {
		setFlash({ type: 'error', message: error.message }, cookies);
		return fail(500, { message: error.message, form });
	}

	getTenants().refresh();

	return redirect(302, '/tenants');
});

export const getTenant = query<z.ZodNumber, Tenant>(z.number(), async (id) => {
	const { locals: { supabase } } = getRequestEvent();

	const { data: tenant, error: tenantError } = await supabase
		.from('tenants')
		.select('*, address:addresses(*)')
		.eq('id', id)
		.single();

	if (tenantError) {
		return error(500, 'Error fetching tenant, please try again later.');
	}

	return tenant;
});

export const updateTenant = form(createTenantSchema, async (data) => {
	const { locals: { supabase }, cookies, params: { id } } = getRequestEvent();

	const { address: addressData, ...tenantData } = data;
	const { id: addressId, ...addressFields } = addressData;

	if (addressId) {
		const { error: addressError } = await supabase
			.from('addresses')
			.update(addressFields)
			.eq('id', addressId);

		if (addressError) {
			setFlash(
				{
					type: 'error',
					message: addressError.message,
				},
				cookies
			);
			return fail(500, {
				message: addressError.message,
				form,
			});
		}
	} else {
		const { data: address, error: addressError } = await supabase
			.from('addresses')
			.insert(addressFields)
			.select('id')
			.single();

		if (addressError) {
			setFlash(
				{
					type: 'error',
					message: addressError.message,
				},
				cookies
			);
			return fail(500, {
				message: addressError.message,
				form,
			});
		}

		Object.assign(tenantData, { address_id: address?.id });
	}

	const { error } = await supabase
		.from('tenants')
		.update(tenantData)
		.eq('id', Number(id));

	if (error) {
		setFlash({ type: 'error', message: error.message }, cookies);
		return fail(500, { message: error.message, form });
	}

	getTenants().refresh();
});
