import { z } from 'zod';

export const createRentPaymentSchema = z.object({
	date: z.string().min(1, 'Date is required.'),
	value: z.coerce.number().min(1, 'Value is required.'),
	description: z.string().nullish(),
});

export type CreateRentPaymentSchema = typeof createRentPaymentSchema;
