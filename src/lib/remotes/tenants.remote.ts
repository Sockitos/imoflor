import { form, getRequestEvent, query } from '$app/server';
import { genderSchema } from '@/schemas/gender';
import { maritalStatusSchema } from '@/schemas/marital-status';
import { deleteTenantSchema } from '@/schemas/tenant';
import { error, fail } from '@sveltejs/kit';
import { z } from 'zod';

export const getTenants = query(async () => {
	const event = getRequestEvent();

	const { data: tenants, error: tenantsError } = await event.locals.supabase
		.from('tenants')
		.select('*');

	if (tenantsError) {
		return error(500, 'Error fetching tenants, please try again later.');
	}

	return tenants;
});

const createTenantFormSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	gender: genderSchema,
	marital_status: maritalStatusSchema,
	nationality: z.string().min(1, 'Nationality is required'),
	birth_date: z.string().optional(),
	id_type: z.string().min(1, 'ID Type is required'),
	id_expiration_date: z.string().optional(),
	id_number: z.string().min(1, 'ID Number is required'),
	tax_id_number: z.string().min(1, 'Tax ID Number is required'),
	country: z.string().optional(),
	region: z.string().optional(),
	address: z.string().optional(),
	postal_code: z.string().optional(),
	city: z.string().optional(),
	email: z.string().optional(),
	mobile: z.string().optional(),
	phone: z.string().optional(),
});

export const createTenant = form(createTenantFormSchema, async (data) => {
	const event = getRequestEvent();

	const { error: insertError } = await event.locals.supabase.from('tenants').insert(data);

	if (insertError) {
		return fail(500, { message: insertError.message, form });
	}

	getTenants().refresh();
});

export const deleteTenant = form(deleteTenantSchema, async ({ id }) => {
	const event = getRequestEvent();

	const { error: deleteError } = await event.locals.supabase.from('tenants').delete().eq('id', id);

	if (deleteError) {
		return fail(500, { message: deleteError.message, form });
	}

	getTenants().refresh();
});

export const getTenant = query(z.number(), async (id) => {
	const event = getRequestEvent();

	const { data: tenant, error: tenantError } = await event.locals.supabase
		.from('tenants')
		.select('*')
		.eq('id', id)
		.single();

	if (tenantError) {
		return error(500, 'Error fetching tenant, please try again later.');
	}

	return tenant;
});

export const updateTenant = form(
	createTenantFormSchema.extend({ id: z.number() }),
	async ({ id, ...data }) => {
		const event = getRequestEvent();

		const { error: updateError } = await event.locals.supabase
			.from('tenants')
			.update(data)
			.eq('id', id);

		if (updateError) {
			return fail(500, { message: updateError.message, form });
		}

		getTenants().refresh();
	}
);
