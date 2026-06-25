import { addressSchema, deleteByIdSchema, idSchema } from '@/shared/schemas';
import { z } from 'zod';
import { fractionTypeValues, propertyClassValues, propertyTypeValues } from './types';

export const propertyClassSchema = z.enum(propertyClassValues);
export const propertyTypeSchema = z.enum(propertyTypeValues);

export const propertySchema = z.object({
	id: idSchema.optional(),
	class: propertyClassSchema,
	type: propertyTypeSchema,
	matrix: z.string().min(1, 'Matrix is required'),
	conservatory: z.string().min(1, 'Conservatory is required'),
	area: z.number().optional(),
	tipology: z.string().optional(),
	description: z.string().optional(),
	patrimonial_value: z.number().optional(),
	market_value: z.number().optional(),
	address: addressSchema,
});

export const deletePropertySchema = deleteByIdSchema;

export type PropertySchema = typeof propertySchema;
export type DeletePropertySchema = typeof deletePropertySchema;

export const fractionTypeSchema = z.enum(fractionTypeValues);

export const fractionSchema = z.object({
	id: idSchema.optional(),
	class: propertyClassSchema,
	type: fractionTypeSchema,
	matrix: z.string().min(1, 'Matrix is required'),
	conservatory: z.string().min(1, 'Conservatory is required'),
	area: z.number().optional(),
	tipology: z.string().optional(),
	description: z.string().optional(),
	patrimonial_value: z.number().optional(),
	market_value: z.number().optional(),
	address: addressSchema,
	fraction: z.string().min(1, 'Fraction is required'),
	parent_id: idSchema,
});

export const deleteFractionSchema = z.object({
	id: idSchema,
	parent_id: idSchema,
});

export type FractionSchema = typeof fractionSchema;
export type DeleteFractionSchema = typeof deleteFractionSchema;
