import { z } from 'zod';

export const createPropertySchema = z.object({
	type: z
		.enum(['building', 'terrain', 'house', 'garages'], {
			errorMap: () => ({ message: 'Type is required' }),
		})
		.default('' as 'building'),
	is_multi_unit: z.boolean().default(true),
	matrix: z.string().min(1, 'Matrix is required.'),
	area: z.coerce.number().optional(),
	tipology: z.string().optional(),
	description: z.string().optional(),
	conservatory: z.string().optional(),
	patrimonial_value: z.coerce.number().optional(),
	market_value: z.coerce.number().optional(),
	country: z.string().optional(),
	region: z.string().optional(),
	address: z.string().optional(),
	postal_code: z.string().optional(),
	city: z.string().optional(),
});

export type CreatePropertySchema = typeof createPropertySchema;

export const updatePropertySchema = z.object({
	id: z.number(),
	type: z
		.enum(['building', 'terrain', 'house', 'garages'], {
			errorMap: () => ({ message: 'Type is required' }),
		})
		.default('' as 'building'),
	is_multi_unit: z.boolean().default(true),
	matrix: z.string().min(1, 'Matrix is required.'),
	area: z.coerce.number().optional(),
	tipology: z.string().optional(),
	description: z.string().optional(),
	conservatory: z.string().optional(),
	patrimonial_value: z.coerce.number().optional(),
	market_value: z.coerce.number().optional(),
	country: z.string().optional(),
	region: z.string().optional(),
	address: z.string().optional(),
	postal_code: z.string().optional(),
	city: z.string().optional(),
});

export type UpdatePropertySchema = typeof updatePropertySchema;

export const deletePropertySchema = z.object({
	id: z.number(),
});

export type DeletePropertySchema = typeof deletePropertySchema;
