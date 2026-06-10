import { deleteByIdSchema, idSchema } from '@/shared/schemas';
import { z } from 'zod';
import { interventionStatusValues, interventionTypeValues } from './types';

export const interventionTypeSchema = z.enum(interventionTypeValues);
export const interventionStatusSchema = z.enum(interventionStatusValues);

export const interventionSchema = z.object({
	id: idSchema.optional(),
	type: interventionTypeSchema,
	status: interventionStatusSchema,
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	description: z.string().min(1, 'Description is required'),
	property_id: idSchema,
	ticket_id: idSchema.optional(),
});

export const deleteInterventionSchema = deleteByIdSchema;

export const interventionPaymentSchema = z.object({
	id: idSchema,
	intervention_id: idSchema,
	movement_id: idSchema,
});

export type InterventionSchema = typeof interventionSchema;
export type DeleteInterventionSchema = typeof deleteInterventionSchema;
export type InterventionPaymentSchema = typeof interventionPaymentSchema;
