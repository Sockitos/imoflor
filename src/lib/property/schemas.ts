import { addressSchema, deleteByIdSchema, idSchema } from '@shared/schemas';
import { z } from 'zod';
import { fractionTypeValues, propertyClassValues, propertyTypeValues } from './types';

export const propertyClassSchema = z.enum(propertyClassValues);
export const propertyTypeSchema = z.enum(propertyTypeValues);

const propertySchema = z.object({
	class: propertyClassSchema,
	type: propertyTypeSchema,
	matrix: z.string().min(1, 'Matrix is required'),
	conservatory: z.string().min(1, 'Conservatory is required'),
	area: z.coerce.number().nullish(),
	tipology: z.string().nullish(),
	description: z.string().nullish(),
	patrimonial_value: z.coerce.number().nullish(),
	market_value: z.coerce.number().nullish(),
	address: addressSchema,
});

export const createPropertySchema = propertySchema;

export const updatePropertySchema = propertySchema.partial().extend({
	id: idSchema,
});

export const deletePropertySchema = deleteByIdSchema;

export type CreatePropertySchema = typeof createPropertySchema;
export type UpdatePropertySchema = typeof updatePropertySchema;
export type DeletePropertySchema = typeof deletePropertySchema;

export const fractionTypeSchema = z.enum(fractionTypeValues);

const fractionSchema = z.object({
	class: propertyClassSchema,
	type: fractionTypeSchema,
	matrix: z.string().min(1, 'Matrix is required'),
	conservatory: z.string().min(1, 'Conservatory is required'),
	area: z.coerce.number().nullish(),
	tipology: z.string().nullish(),
	description: z.string().nullish(),
	patrimonial_value: z.coerce.number().nullish(),
	market_value: z.coerce.number().nullish(),
	address: addressSchema,
	fraction: z.string().min(1, 'Fraction is required'),
	parent_id: idSchema,
});

export const createFractionSchema = fractionSchema;

export const updateFractionSchema = fractionSchema.partial().extend({
	id: idSchema,
});

export const deleteFractionSchema = deleteByIdSchema;

export type CreateFractionSchema = typeof createFractionSchema;
export type UpdateFractionSchema = typeof updateFractionSchema;
export type DeleteFractionSchema = typeof deleteFractionSchema;
