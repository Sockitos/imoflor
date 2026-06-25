import { deleteByIdSchema, idSchema } from '@/shared/schemas';
import { z } from 'zod';
import { ticketPriorityValues, ticketStatusValues } from './types';

export const ticketPrioritySchema = z.enum(ticketPriorityValues).default('low');
export const ticketStatusSchema = z.enum(ticketStatusValues).default('open');

export const ticketSchema = z.object({
	id: idSchema.optional(),
	date: z.string().min(1, 'Date is required'),
	description: z.string().min(1, 'Description is required'),
	priority: ticketPrioritySchema,
	property_id: idSchema,
	status: ticketStatusSchema,
	title: z.string().min(1, 'Title is required'),
});

export const deleteTicketSchema = deleteByIdSchema;

export type TicketSchema = typeof ticketSchema;
export type DeleteTicketSchema = typeof deleteTicketSchema;
