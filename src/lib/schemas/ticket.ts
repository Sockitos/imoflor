import { z } from 'zod';

export const priorityOptions = {
	low: 'Low',
	medium: 'Medium',
	high: 'High',
};

type Priority = keyof typeof priorityOptions;

export const prioritySchema = z
	.enum(['', ...(Object.keys(priorityOptions) as [Priority, ...Priority[]])])
	.refine((value) => value !== '', {
		message: 'Priority is required',
	});

export const statusOptions = {
	open: 'Open',
	in_progress: 'In Progress',
	resolved: 'Resolved',
	cancelled: 'Cancelled',
};

type Status = keyof typeof statusOptions;

export const statusSchema = z
	.enum(['', ...(Object.keys(statusOptions) as [Status, ...Status[]])])
	.refine((value) => value !== '', {
		message: 'Status is required',
	});

export const createTicketSchema = z.object({
	date: z.string().min(1, 'Date is required.'),
	priority: prioritySchema,
	status: statusSchema,
	title: z.string().min(1, 'Title is required.'),
	description: z.string().min(1, 'Description is required.'),
	property_id: z.number().min(1, 'Property is required.'),
	fraction_id: z.number().nullish(),
});

export type CreateTicketSchema = typeof createTicketSchema;

export const deleteTicketSchema = z.object({
	id: z.number(),
});

export type DeleteTicketSchema = typeof deleteTicketSchema;
