import { z } from 'zod';

export const createContractSchema = z.object({
	id: z.number(),
	fraction_id: z.number(),
	start_date: z.string(),
	end_date: z.string().optional(),
	balance: z.number(),
	type: z.enum(['renting', 'lending']),
	data: z.object({
		installment: z.number().optional(),
		rent: z.number().optional(),
	}),
});

export type CreateContractSchema = typeof createContractSchema;

export const updateContractSchema = z.object({
	id: z.number(),
	fraction_id: z.number(),
	start_date: z.string(),
	end_date: z.string().optional(),
	balance: z.number(),
	type: z.enum(['renting', 'lending']),
	data: z.object({
		installment: z.number().optional(),
		rent: z.number().optional(),
	}),
});

export type UpdateContractSchema = typeof updateContractSchema;

export const deleteContractSchema = z.object({
	id: z.number(),
});

export type DeleteContractSchema = typeof deleteContractSchema;
