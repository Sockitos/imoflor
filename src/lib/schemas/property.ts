import { z } from 'zod';

export const propertyClass = ['urban', 'rustic'] as const;
export const propertyClassOptions = {
	urban: 'Urban',
	rustic: 'Rustic',
};
export const propertyClassSchema = z.enum(propertyClass).default('urban');

export const propertyType = ['building', 'terrain', 'house', 'garages'] as const;
export const propertyTypeOptions = {
	building: 'Building',
	terrain: 'Terrain',
	house: 'House',
	garages: 'Garages',
};
export const propertyTypeSchema = z.enum(propertyType).default('building');

export const createPropertySchema = z.object({
	class: propertyClassSchema,
	type: propertyTypeSchema,
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
