import { z } from 'zod';

export const createContractSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('renting'),
		fraction_id: z.number().min(1, 'Fraction is required.'),
		start_date: z.string().min(1, 'Start Date is required.'),
		end_date: z.string().nullish(),
		tenant_id: z.number().min(1, 'Tenant is required.'),
		rent: z.coerce.number().min(0, 'Rent is required.'),
	}),
	z.object({
		type: z.literal('lending'),
		fraction_id: z.number().min(1, 'Fraction is required.'),
		start_date: z.string().min(1, 'Start Date is required.'),
		end_date: z.string().nullish(),
		tenant_id: z.number().min(1, 'Tenant is required.'),
		sale_value: z.coerce.number().min(0, 'Sale Value is required.'),
		down_payment: z.coerce.number().min(0, 'Down Payment is required.'),
		yearly_raise: z.coerce.number().min(0, 'Yearly Raise is required.'),
		installment: z.coerce.number().min(0, 'Installment is required.'),
		interest: z.coerce.number().min(0, 'Interest is required.'),
	}),
]);

export type CreateContractSchema = typeof createContractSchema;

export const deleteContractSchema = z.object({
	id: z.number(),
});

export type DeleteContractSchema = typeof deleteContractSchema;
