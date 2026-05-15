import { addressSchema, deleteByIdSchema, idSchema } from '@/shared/schemas';
import { z } from 'zod';

const vendorSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	tax_id_number: z.string().min(1, 'Tax ID Number is required'),
	description: z.string().nullish(),
	tags: z.array(z.string()),
	address: addressSchema,
	website: z.string().nullish(),
	email: z.string().nullish(),
	mobile: z.string().nullish(),
	phone: z.string().nullish(),
});

export const createVendorSchema = vendorSchema;

export const updateVendorSchema = vendorSchema.extend({
	id: idSchema,
});

export const deleteVendorSchema = deleteByIdSchema;

export type CreateVendorSchema = typeof createVendorSchema;
export type UpdateVendorSchema = typeof updateVendorSchema;
export type DeleteVendorSchema = typeof deleteVendorSchema;
