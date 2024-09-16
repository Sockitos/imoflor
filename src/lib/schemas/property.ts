import { z } from 'zod';

export const typeOptions = {
	building: 'Building',
	terrain: 'Terrain',
	house: 'House',
	garages: 'Garages',
};

type Type = keyof typeof typeOptions;

export const typeSchema = z
	.enum(['', ...(Object.keys(typeOptions) as [Type, ...Type[]])])
	.refine((value) => value !== '', {
		message: 'Type is required',
	});

export const createPropertySchema = z.object({
	type: typeSchema,
	is_multi_unit: z.boolean().default(true),
	matrix: z.string().min(1, 'Matrix is required.'),
	conservatory: z.string().min(1, 'Conservatory is required.'),
	area: z.coerce.number().nullish(),
	tipology: z.string().nullish(),
	description: z.string().nullish(),
	patrimonial_value: z.coerce.number().nullish(),
	market_value: z.coerce.number().nullish(),
	country: z.string().min(1, 'Country is required.'),
	region: z.string().min(1, 'Region is required.'),
	address: z.string().min(1, 'Address is required.'),
	postal_code: z.string().min(1, 'Postal Code is required.'),
	city: z.string().min(1, 'City is required.'),
});

export type CreatePropertySchema = typeof createPropertySchema;

export const deletePropertySchema = z.object({
	id: z.number(),
});

export type DeletePropertySchema = typeof deletePropertySchema;
