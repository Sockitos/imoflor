import { z } from 'zod';

export const interventionType = ['new', 'renovation', 'maintenance'] as const;
export const interventionTypeOptions = {
	new: 'New',
	renovation: 'Renovation',
	maintenance: 'Maintenance',
};
export const interventionTypeSchema = z.enum(interventionType).default('new');

export const interventionStatus = ['not_started', 'in_progress', 'completed', 'cancelled'] as const;
export const interventionStatusOptions = {
	not_started: 'Not Started',
	in_progress: 'In Progress',
	completed: 'Completed',
	cancelled: 'Cancelled',
};
export const interventionStatusSchema = z.enum(interventionStatus).default('not_started');

export const createInterventionSchema = z.object({
	type: interventionTypeSchema,
	status: interventionStatusSchema,
	start_date: z.string().nullish(),
	end_date: z.string().nullish(),
	description: z.string().min(1, 'Description is required.'),
	property_id: z.number().min(1, 'Property is required.'),
	fraction_id: z.number().nullish(),
	ticket_id: z.number().nullish(),
});

export type CreateInterventionSchema = typeof createInterventionSchema;

export const deleteInterventionSchema = z.object({
	id: z.number(),
});

export type DeleteInterventionSchema = typeof deleteInterventionSchema;
