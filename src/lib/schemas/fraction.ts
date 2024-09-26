import { z } from 'zod';

export const typeOptions = {
	apartment: 'Apartment',
	store: 'Store',
	garage: 'Garage',
	house: 'House',
	terrain: 'Terrain',
};

type Type = keyof typeof typeOptions;

export const typeSchema = z
	.enum(['', ...(Object.keys(typeOptions) as [Type, ...Type[]])])
	.refine((value) => value !== '', {
		message: 'Type is required',
	});

export const createFractionSchema = z.object({
	type: typeSchema,
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
