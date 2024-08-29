import { z } from 'zod';

export const createVendorSchema = z.object({
	name: z.string().min(1, 'Name is required.'),
	nif: z.string().min(1, 'NIF is required.'),
	description: z.string().optional(),
	tags: z.string().array(),
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
	id: z.number(),
	name: z.string().min(1, 'Name is required.'),
	nif: z.string().min(1, 'NIF is required.'),
	description: z.string().optional(),
	tags: z.string().array(),
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
	id: z.number(),
});

export type DeleteVendorSchema = typeof deleteVendorSchema;
