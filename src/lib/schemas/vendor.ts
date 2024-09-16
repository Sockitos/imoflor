import { z } from 'zod';

export const createVendorSchema = z.object({
	name: z.string().min(1, 'Name is required.'),
	tax_id_number: z.string().min(1, 'Fiscal Number is required'),
	description: z.string().nullish(),
	tags: z.string().array(),
	country: z.string().nullish(),
	region: z.string().nullish(),
	address: z.string().nullish(),
	postal_code: z.string().nullish(),
	city: z.string().nullish(),
	email: z.string().nullish(),
	mobile: z.string().nullish(),
	phone: z.string().nullish(),
	website: z.string().nullish(),
});

export type CreateVendorSchema = typeof createVendorSchema;

export const deleteVendorSchema = z.object({
	id: z.number(),
});

export type DeleteVendorSchema = typeof deleteVendorSchema;
