import { addressSchema, deleteByIdSchema, idSchema } from '@/shared/schemas';
import { z } from 'zod';

export const vendorSchema = z.object({
	id: idSchema.optional(),
	name: z.string().min(1, 'Name is required'),
	tax_id_number: z.string().min(1, 'Tax ID Number is required'),
	description: z.string().optional(),
	tags: z.array(z.string()).default([]),
	address: addressSchema,
	website: z.string().optional(),
	email: z.string().optional(),
	mobile: z.string().optional(),
	phone: z.string().optional(),
});

export const deleteVendorSchema = deleteByIdSchema;

export type VendorSchema = typeof vendorSchema;
export type DeleteVendorSchema = typeof deleteVendorSchema;
