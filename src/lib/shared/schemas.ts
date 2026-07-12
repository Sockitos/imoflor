import { z } from 'zod';
import { genderValues, maritalStatusValues } from './types';

export const idSchema = z.number().int().positive();

export const deleteByIdSchema = z.object({
	id: idSchema,
});

export const addressSchema = z.object({
	id: idSchema.optional(),
	address: z.string(),
	city: z.string(),
	country: z.string(),
	postal_code: z.string(),
	region: z.string(),
});

export const genderSchema = z.enum(genderValues);

export const maritalStatusSchema = z.enum(maritalStatusValues);

export const deleteByIdsSchema = z.object({
	ids: z.array(idSchema),
});
