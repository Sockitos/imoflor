import { z } from 'zod';

export const typeOptions = {
	new: 'New',
	renovation: 'Renovation',
	maintenance: 'Maintenance',
};

type Type = keyof typeof typeOptions;

export const typeSchema = z
	.enum(['', ...(Object.keys(typeOptions) as [Type, ...Type[]])])
	.refine((value) => value !== '', {
		message: 'Type is required',
	});

export const statusOptions = {
	not_started: 'Not Started',
	in_progress: 'In Progress',
	completed: 'Completed',
	cancelled: 'Cancelled',
};

type Status = keyof typeof statusOptions;

export const statusSchema = z
	.enum(['', ...(Object.keys(statusOptions) as [Status, ...Status[]])])
	.refine((value) => value !== '', {
		message: 'Status is required',
	});

export const createInterventionSchema = z.object({
	type: typeSchema,
	status: statusSchema,
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
