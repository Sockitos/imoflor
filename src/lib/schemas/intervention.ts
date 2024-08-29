import { z } from 'zod';

export const createInterventionSchema = z.object({
	type: z
		.enum(['new', 'renovation', 'maintenance'], {
			errorMap: () => ({ message: 'Type is required' }),
		})
		.default('' as 'new'),
	status: z
		.enum(['not_started', 'in_progress', 'completed', 'cancelled'], {
			errorMap: () => ({ message: 'Status is required' }),
		})
		.default('' as 'not_started'),
	start_date: z.string().min(1, 'Start Date is required.'),
	end_date: z.string().optional(),
	description: z.string().min(1, 'Description is required.'),
	property_id: z.number().min(1, 'Property is required.'),
	fraction_id: z.number().optional(),
	ticket_id: z.number().optional(),
});

export type CreateInterventionSchema = typeof createInterventionSchema;

export const updateInterventionSchema = z.object({
	id: z.number(),
	type: z
		.enum(['new', 'renovation', 'maintenance'], {
			errorMap: () => ({ message: 'Type is required' }),
		})
		.default('' as 'new'),
	status: z
		.enum(['not_started', 'in_progress', 'completed', 'cancelled'], {
			errorMap: () => ({ message: 'Status is required' }),
		})
		.default('' as 'not_started'),
	start_date: z.string().min(1, 'Start Date is required.'),
	end_date: z.string().optional(),
	description: z.string().min(1, 'Description is required.'),
	property_id: z.number().min(1, 'Property is required.'),
	fraction_id: z.number().optional(),
	ticket_id: z.number().optional(),
});

export type UpdateInterventionSchema = typeof updateInterventionSchema;

export const deleteInterventionSchema = z.object({
	id: z.number(),
});

export type DeleteInterventionSchema = typeof deleteInterventionSchema;
