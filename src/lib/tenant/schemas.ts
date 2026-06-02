import { addressSchema, genderSchema, idSchema, maritalStatusSchema } from '@/shared/schemas';
import { z } from 'zod';

export const tenantSchema = z.object({
	id: idSchema.optional(),
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

export type TenantSchema = typeof tenantSchema;
