import { z } from 'zod';

export const createTicketSchema = z.object({
	date: z.string().min(1, 'Date is required.'),
	priority: z
		.enum(['low', 'medium', 'high'], {
			errorMap: () => ({ message: 'Priority is required' }),
		})
		.default('' as 'low'),
	status: z
		.enum(['open', 'in_progress', 'resolved', 'cancelled'], {
			errorMap: () => ({ message: 'Status is required' }),
		})
		.default('' as 'open'),
	title: z.string().min(1, 'Title is required.'),
	description: z.string().min(1, 'Description is required.'),
	property_id: z.number().min(1, 'Property is required.'),
	fraction_id: z.number().optional(),
});

export type CreateTicketSchema = typeof createTicketSchema;

export const updateTicketSchema = z.object({
	id: z.number(),
	date: z.string().min(1, 'Date is required.'),
	priority: z
		.enum(['low', 'medium', 'high'], {
			errorMap: () => ({ message: 'Priority is required' }),
		})
		.default('' as 'low'),
	status: z
		.enum(['open', 'in_progress', 'resolved', 'cancelled'], {
			errorMap: () => ({ message: 'Status is required' }),
		})
		.default('' as 'open'),
	title: z.string().min(1, 'Title is required.'),
	description: z.string().min(1, 'Description is required.'),
	property_id: z.number().min(1, 'Property is required.'),
	fraction_id: z.number().optional(),
});

export type UpdateTicketSchema = typeof updateTicketSchema;

export const deleteTicketSchema = z.object({
	id: z.number(),
});

export type DeleteTicketSchema = typeof deleteTicketSchema;
