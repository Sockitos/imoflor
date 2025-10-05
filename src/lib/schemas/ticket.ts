import { z } from 'zod';

export const ticketPriority = ['low', 'medium', 'high'] as const;
export const ticketPriorityOptions = {
	low: 'Low',
	medium: 'Medium',
	high: 'High',
};
export const ticketPrioritySchema = z.enum(ticketPriority).default('low');

export const ticketStatus = ['open', 'in_progress', 'resolved', 'cancelled'] as const;
export const ticketStatusOptions = {
	open: 'Open',
	in_progress: 'In Progress',
	resolved: 'Resolved',
	cancelled: 'Cancelled',
};
export const ticketStatusSchema = z.enum(ticketStatus).default('open');

export const createTicketSchema = z.object({
	date: z.string().min(1, 'Date is required.'),
	priority: ticketPrioritySchema,
	status: ticketStatusSchema,
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
