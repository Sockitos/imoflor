import { z } from 'zod';

export const fractionSchema = z.object({
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

export type FractionSchema = typeof fractionSchema;
