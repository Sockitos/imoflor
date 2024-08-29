import { z } from 'zod';

export const createTenantSchema = z.object({
	name: z.string().min(1, 'Name is required.'),
	nif: z.string().min(1, 'NIF is required.'),
	gender: z
		.enum(['male', 'female', 'other'], {
			errorMap: () => ({ message: 'Gender is required' }),
		})
		.default('' as 'male'),
	marital_status: z
		.enum(['single', 'married', 'union', 'divorced', 'widowed'], {
			errorMap: (e) => ({ message: e.message ?? 'Marital Status is required' }),
		})
		.default('' as 'single'),
	nationality: z.string().min(1, 'Nationality is required.'),
	birth_date: z.string().optional(),
	id_type: z.string().optional(),
	id_expiration_date: z.string().optional(),
	id_number: z.string().optional(),
	ss_number: z.string().optional().optional(),
	country: z.string().optional(),
	region: z.string().optional(),
	address: z.string().optional(),
	postal_code: z.string().optional(),
	city: z.string().optional(),
	email: z.string().optional(),
	mobile: z.string().optional(),
	phone: z.string().optional().optional(),
});

export type CreateTenantSchema = typeof createTenantSchema;

export const updateTenantSchema = z.object({
	id: z.number(),
	name: z.string().min(1, 'Name is required.'),
	nif: z.string().min(1, 'NIF is required.'),
	gender: z
		.enum(['male', 'female', 'other'], {
			errorMap: () => ({ message: 'Gender is required' }),
		})
		.default('' as 'male'),
	marital_status: z
		.enum(['single', 'married', 'union', 'divorced', 'widowed'], {
			errorMap: (e) => ({ message: e.message ?? 'Marital Status is required' }),
		})
		.default('' as 'single'),
	nationality: z.string().min(1, 'Nationality is required.'),

	birth_date: z.string().optional(),
	id_type: z.string().optional(),
	id_expiration_date: z.string().optional(),
	id_number: z.string().optional(),
	ss_number: z.string().optional().optional(),
	country: z.string().optional(),
	region: z.string().optional(),
	address: z.string().optional(),
	postal_code: z.string().optional(),
	city: z.string().optional(),
	email: z.string().optional(),
	mobile: z.string().optional(),
	phone: z.string().optional().optional(),
});

export type UpdateTenantSchema = typeof updateTenantSchema;

export const deleteTenantSchema = z.object({
	id: z.number(),
});

export type DeleteTenantSchema = typeof deleteTenantSchema;
