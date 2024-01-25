import { z } from 'zod';

export const createTicketSchema = z.object({
	id: z.number(),
	date: z.string(),
	priority: z.enum(['low', 'medium', 'high']),
	status: z.enum(['pending', 'in_progress', 'completed', 'canceled']),
	title: z.string(),
	description: z.string(),
	property_id: z.number(),
	fraction_id: z.number().optional(),
});

export type CreateTicketSchema = typeof createTicketSchema;

export const updateTicketSchema = z.object({
	id: z.number(),
	date: z.string(),
	priority: z.enum(['low', 'medium', 'high']),
	status: z.enum(['pending', 'in_progress', 'completed', 'canceled']),
	title: z.string(),
	description: z.string(),
	property_id: z.number(),
	fraction_id: z.number().optional(),
});

export type UpdateTicketSchema = typeof updateTicketSchema;

export const deleteTicketSchema = z.object({
	id: z.number(),
});

export type DeleteTicketSchema = typeof deleteTicketSchema;
