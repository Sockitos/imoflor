import { z } from 'zod';

export const createFractionSchema = z.object({
	type: z
		.enum(['apartment', 'store', 'garage', 'house', 'terrain'], {
			errorMap: () => ({ message: 'Type is required' }),
		})
		.default('' as 'apartment'),
	matrix: z.string().min(1, 'Matrix is required.'),
	sold: z.boolean(),
	area: z.coerce.number().optional(),
	tipology: z.string().optional(),
	description: z.string().optional(),
	conservatory: z.string().optional(),
	patrimonial_value: z.coerce.number().optional(),
	market_value: z.coerce.number().optional(),
	address: z.string().optional(),
});

export type CreateFractionSchema = typeof createFractionSchema;

export const updateFractionSchema = z.object({
	id: z.number(),
	type: z
		.enum(['apartment', 'store', 'garage', 'house', 'terrain'], {
			errorMap: () => ({ message: 'Type is required' }),
		})
		.default('' as 'apartment'),
	matrix: z.string().min(1, 'Matrix is required.'),
	sold: z.boolean(),
	area: z.coerce.number().optional(),
	tipology: z.string().optional(),
	description: z.string().optional(),
	conservatory: z.string().optional(),
	patrimonial_value: z.coerce.number().optional(),
	market_value: z.coerce.number().optional(),
	address: z.string().optional(),
});

export type UpdateFractionSchema = typeof updateFractionSchema;

export const deleteFractionSchema = z.object({
	id: z.number(),
});

export type DeleteFractionSchema = typeof deleteFractionSchema;
