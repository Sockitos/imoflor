import { z } from 'zod';

export const createRentUpdateSchema = z.object({
	rent: z.coerce.number().min(0, 'Rent is required.'),
	update_date: z.string().min(1, 'Update Date is required.'),
});

export type CreateRentUpdateSchema = typeof createRentUpdateSchema;
