import { deleteByIdSchema, idSchema } from '@/shared/schemas';
import { z } from 'zod';
import { contractAccountTypeValues } from './types';

export const contractAccountTypeSchema = z.enum(contractAccountTypeValues);

const contractBaseSchema = z.object({
	id: idSchema.optional(),
	property_id: idSchema,
	start_date: z.string().min(1, 'Start Date is required'),
	end_date: z.string().optional(),
	tenant_id: idSchema,
});

const rentingContractSchema = contractBaseSchema.extend({
	type: z.literal('renting'),
	rent: z.number().min(0, 'Rent is required'),
});

const lendingContractSchema = contractBaseSchema.extend({
	type: z.literal('lending'),
	sale_value: z.number().min(0, 'Sale Value is required'),
	down_payment: z.number().min(0, 'Down Payment is required'),
	yearly_raise: z.number().min(0, 'Yearly Raise is required'),
	installment: z.number().min(0, 'Installment is required'),
	interest: z.number().min(0, 'Interest is required'),
});

export const contractSchema = z.discriminatedUnion('type', [
	rentingContractSchema,
	lendingContractSchema,
]);

export const deleteContractSchema = deleteByIdSchema;

export const createRentUpdateSchema = z.object({
	contract_id: z.number(),
	rent: z.number().min(0, 'Rent is required'),
	update_date: z.string().min(1, 'Update Date is required'),
});

export const createInstallmentUpdateSchema = z.object({
	contract_id: z.number(),
	installment: z.number().min(0, 'Installment is required'),
	interest: z.number().min(0, 'Interest is required'),
	update_date: z.string().min(1, 'Update Date is required'),
});

export const createDueNoteSchema = z.object({
	contract_id: z.number(),
	due_date: z.string().min(1, 'Due date is required'),
	value: z.number().min(0, 'Value is required'),
});

export const createRentPaymentSchema = z.object({
	contract_id: z.number(),
	date: z.string().min(1, 'Date is required'),
	value: z.number().min(1, 'Value is required'),
	description: z.string().optional(),
});

export const createInstallmentPaymentSchema = z
	.object({
		contract_id: z.number(),
		date: z.string().min(1, 'Date is required'),
		value: z.number().min(0, 'Value is required'),
		amortization: z.number(),
		interest: z.number().min(0, 'Interest is required'),
		description: z.string().optional(),
	})
	.refine((data) => data.amortization + data.interest === data.value, {
		message: 'The sum of amortization and interest must be equal to the value',
		path: ['value'],
	});

export const contractAccountItemSchema = z.object({
	id: idSchema,
	date: z.string().min(1, 'Date is required'),
	value: z.number(),
	type: contractAccountTypeSchema,
});

export type ContractSchema = typeof contractSchema;
export type DeleteContractSchema = typeof deleteContractSchema;
export type CreateRentUpdateSchema = typeof createRentUpdateSchema;
export type CreateInstallmentUpdateSchema = typeof createInstallmentUpdateSchema;
export type CreateDueNoteSchema = typeof createDueNoteSchema;
export type CreateRentPaymentSchema = typeof createRentPaymentSchema;
export type CreateInstallmentPaymentSchema = typeof createInstallmentPaymentSchema;
export type ContractAccountItemSchema = typeof contractAccountItemSchema;
