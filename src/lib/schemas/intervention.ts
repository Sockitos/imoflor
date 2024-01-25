import { z } from 'zod';

export const createInterventionSchema = z.object({
	id: z.number().optional(),
	type: z.enum(['maintenance', 'repair', 'improvement', 'other']),
	status: z.enum(['pending', 'in_progress', 'completed', 'canceled']),
	start_date: z.string(),
	end_date: z.string().optional(),
	description: z.string(),
	property_id: z.number(),
	fraction_id: z.number().optional(),
	ticket_id: z.number().optional(),
});

export type CreateInterventionSchema = typeof createInterventionSchema;

export const updateInterventionSchema = z.object({
	id: z.number(),
	type: z.enum(['maintenance', 'repair', 'improvement', 'other']),
	status: z.enum(['pending', 'in_progress', 'completed', 'canceled']),
	start_date: z.string(),
	end_date: z.string().optional(),
	description: z.string(),
	property_id: z.number(),
	fraction_id: z.number().optional(),
	ticket_id: z.number().optional(),
});

export type UpdateInterventionSchema = typeof updateInterventionSchema;

export const deleteInterventionSchema = z.object({
	id: z.number(),
});

export type DeleteInterventionSchema = typeof deleteInterventionSchema;
