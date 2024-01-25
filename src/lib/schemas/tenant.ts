import { z } from 'zod';

export const createTenantSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	nif: z.string(),
	gender: z.enum(['male', 'female', 'other']),
	marital_status: z.enum(['single', 'married', 'union', 'divorced', 'widowed']),
	nationality: z.string(),
	birth_date: z.date().optional(),
	id_type: z.string().optional(),
	id_expiration_date: z.date().optional(),
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
	id: z.string(),
	name: z.string(),
	nif: z.string(),
	gender: z.enum(['male', 'female', 'other']),
	marital_status: z.enum(['single', 'married', 'union', 'divorced', 'widowed']),
	nationality: z.string(),
	birth_date: z.date().optional(),
	id_type: z.string().optional(),
	id_expiration_date: z.date().optional(),
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
	id: z.string(),
});

export type DeleteTenantSchema = typeof deleteTenantSchema;
