import { z } from 'zod';

export const createInstallmentUpdateSchema = z.object({
	installment: z.coerce.number().min(0, 'Installment is required.'),
	interest: z.coerce.number().min(0, 'Interest is required.'),
	update_date: z.string().min(1, 'Update Date is required.'),
});

export type CreateInstallmentUpdateSchema = typeof createInstallmentUpdateSchema;
