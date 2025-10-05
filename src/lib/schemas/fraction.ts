import { z } from 'zod';

export const fractionType = ['apartment', 'store', 'garage', 'house', 'terrain'] as const;
export const fractionTypeOptions = {
	apartment: 'Apartment',
	store: 'Store',
	garage: 'Garage',
	house: 'House',
	terrain: 'Terrain',
};
export const fractionTypeSchema = z.enum(fractionType).default('apartment');

export const createFractionSchema = z.object({
	type: fractionTypeSchema,
	matrix: z.string().min(1, 'Matrix is required.'),
	area: z.coerce.number().nullish(),
	tipology: z.string().nullish(),
	description: z.string().nullish(),
	patrimonial_value: z.coerce.number().nullish(),
	market_value: z.coerce.number().nullish(),
	address: z.string().min(1, 'Address is required.'),
});

export type CreateFractionSchema = typeof createFractionSchema;

export const deleteFractionSchema = z.object({
	id: z.number(),
});

export type DeleteFractionSchema = typeof deleteFractionSchema;
