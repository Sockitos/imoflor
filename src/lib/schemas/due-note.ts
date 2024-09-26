import { z } from 'zod';

export const createDueNoteSchema = z.object({
	due_date: z.string().min(1, 'Due date is required.'),
	value: z.coerce.number().min(0, 'Value is required.'),
});

export type CreateDueNoteSchema = typeof createDueNoteSchema;
