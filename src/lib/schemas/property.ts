import { z } from 'zod';

export const createPropertySchema = z.object({
	id: z.string().optional(),
	type: z.enum(['apartment', 'house', 'land', 'commercial', 'other']),
	is_multi_unit: z.boolean(),
	matrix: z.string(),
	sold: z.boolean(),
	area: z.number().optional(),
	tipology: z.string().optional(),
	description: z.string().optional(),
	conservatory: z.string().optional(),
	patrimonial_value: z.number().optional(),
	market_value: z.number().optional(),
	country: z.string().optional(),
	region: z.string().optional(),
	address: z.string().optional(),
	postal_code: z.string().optional(),
	city: z.string().optional(),
});

export type CreatePropertySchema = typeof createPropertySchema;

export const updatePropertySchema = z.object({
	id: z.string().optional(),
	type: z.enum(['apartment', 'house', 'land', 'commercial', 'other']),
	is_multi_unit: z.boolean(),
	matrix: z.string(),
	sold: z.boolean(),
	area: z.number().optional(),
	tipology: z.string().optional(),
	description: z.string().optional(),
	conservatory: z.string().optional(),
	patrimonial_value: z.number().optional(),
	market_value: z.number().optional(),
	country: z.string().optional(),
	region: z.string().optional(),
	address: z.string().optional(),
	postal_code: z.string().optional(),
	city: z.string().optional(),
});

export type UpdatePropertySchema = typeof updatePropertySchema;

export const deletePropertySchema = z.object({
	id: z.string(),
});

export type DeletePropertySchema = typeof deletePropertySchema;
