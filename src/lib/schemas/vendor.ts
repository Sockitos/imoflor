import { z } from 'zod';

export const createVendorSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	nif: z.string(),
	description: z.string().optional(),
	tags: z.array(z.string()),
	country: z.string().optional(),
	region: z.string().optional(),
	address: z.string().optional(),
	postal_code: z.string().optional(),
	city: z.string().optional(),
	email: z.string().optional(),
	mobile: z.string().optional(),
	phone: z.string().optional(),
	website: z.string().optional(),
});

export type CreateVendorSchema = typeof createVendorSchema;

export const updateVendorSchema = z.object({
	id: z.string(),
	name: z.string(),
	nif: z.string(),
	description: z.string().optional(),
	tags: z.array(z.string()).optional(),
	country: z.string().optional(),
	region: z.string().optional(),
	address: z.string().optional(),
	postal_code: z.string().optional(),
	city: z.string().optional(),
	email: z.string().optional(),
	mobile: z.string().optional(),
	phone: z.string().optional(),
	website: z.string().optional(),
});

export type UpdateVendorSchema = typeof updateVendorSchema;

export const deleteVendorSchema = z.object({
	id: z.string(),
});

export type DeleteVendorSchema = typeof deleteVendorSchema;
