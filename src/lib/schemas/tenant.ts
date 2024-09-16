import { z } from 'zod';
import { genderSchema } from './gender';
import { maritalStatusSchema } from './marital-status';

export const createTenantSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	gender: genderSchema,
	marital_status: maritalStatusSchema,
	nationality: z.string().min(1, 'Nationality is required'),
	birth_date: z.string().nullish(),
	id_type: z.string().min(1, 'ID Type is required'),
	id_expiration_date: z.string().nullish(),
	id_number: z.string().min(1, 'ID Number is required'),
	tax_id_number: z.string().min(1, 'Tax ID Number is required'),
	country: z.string().nullish(),
	region: z.string().nullish(),
	address: z.string().nullish(),
	postal_code: z.string().nullish(),
	city: z.string().nullish(),
	email: z.string().nullish(),
	mobile: z.string().nullish(),
	phone: z.string().nullish(),
});

export type CreateTenantSchema = typeof createTenantSchema;

export const deleteTenantSchema = z.object({
	id: z.number(),
});

export type DeleteTenantSchema = typeof deleteTenantSchema;
