import { z } from 'zod';

export const createInstallmentPaymentSchema = z
	.object({
		date: z.string().min(1, 'Date is required.'),
		value: z.coerce.number().min(0, 'Value is required.'),
		amortization: z.coerce.number(),
		interest: z.coerce.number().min(0, 'Interest is required.'),
		description: z.string().nullish(),
	})
	.refine((data) => data.amortization + data.interest === data.value, {
		message: 'The sum of amortization and interest must be equal to the value.',
		path: ['value'],
	});

export type CreateInstallmentPaymentSchema = typeof createInstallmentPaymentSchema;
