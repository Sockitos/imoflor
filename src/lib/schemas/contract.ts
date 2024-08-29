import { z } from 'zod';

export const createContractSchema2 = z.object({
	fraction_id: z.number().min(1, 'Fraction is required.'),
	start_date: z.string().min(1, 'Start Date is required.'),
	end_date: z.string().optional(),
	rent: z.number().min(1, 'Rent is required.'),
});

export const createContractSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('renting'),
		fraction_id: z.number().min(1, 'Fraction is required.'),
		start_date: z.string().min(1, 'Start Date is required.'),
		end_date: z.string().optional(),
		tenant_id: z.number().min(1, 'Tenant is required.'),
		rent: z.coerce.number().min(1, 'Rent is required.'),
	}),
	z.object({
		type: z.literal('lending'),
		fraction_id: z.number().min(1, 'Fraction is required.'),
		start_date: z.string().min(1, 'Start Date is required.'),
		end_date: z.string().optional(),
		tenant_id: z.number().min(1, 'Tenant is required.'),
		sale_value: z.coerce.number().min(1, 'Sale Value is required.'),
		down_payment: z.coerce.number().min(1, 'Down Payment is required.'),
		yearly_raise: z.coerce.number().min(1, 'Yearly Raise is required.'),
		installment: z.coerce.number().min(1, 'Installment is required.'),
		tax: z.coerce.number().min(1, 'Tax is required.'),
	}),
]);

export type CreateContractSchema = typeof createContractSchema;

export const updateContractSchema = z.discriminatedUnion('type', [
	z.object({
		id: z.number(),
		type: z.literal('renting'),
		fraction_id: z.number().min(1, 'Fraction is required.'),
		start_date: z.string().min(1, 'Start Date is required.'),
		end_date: z.string().optional(),
		tenant_id: z.number().min(1, 'Tenant is required.'),
		rent: z.coerce.number().min(1, 'Rent is required.'),
	}),
	z.object({
		id: z.number(),
		type: z.literal('lending'),
		fraction_id: z.number().min(1, 'Fraction is required.'),
		start_date: z.string().min(1, 'Start Date is required.'),
		end_date: z.string().optional(),
		tenant_id: z.number().min(1, 'Tenant is required.'),
		sale_value: z.coerce.number().min(1, 'Sale Value is required.'),
		down_payment: z.coerce.number().min(1, 'Down Payment is required.'),
		yearly_raise: z.coerce.number().min(1, 'Yearly Raise is required.'),
		installment: z.coerce.number().min(1, 'Installment is required.'),
		tax: z.coerce.number().min(1, 'Tax is required.'),
	}),
]);

export type UpdateContractSchema = typeof updateContractSchema;

export const deleteContractSchema = z.object({
	id: z.number(),
});

export type DeleteContractSchema = typeof deleteContractSchema;
