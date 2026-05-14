import { deleteByIdSchema, idSchema } from "@/shared/schemas";
import { z } from "zod";
import { contractAccountTypeValues } from "./types";

export const contractAccountTypeSchema = z.enum(contractAccountTypeValues);

const contractBaseSchema = z.object({
	property_id: idSchema,
	start_date: z.string().min(1, "Start Date is required"),
	end_date: z.string().nullish(),
	tenant_id: idSchema,
});

const rentingContractSchema = contractBaseSchema.extend({
	type: z.literal("renting"),
	rent: z.coerce.number().min(0, "Rent is required"),
});

const lendingContractSchema = contractBaseSchema.extend({
	type: z.literal("lending"),
	sale_value: z.coerce.number().min(0, "Sale Value is required"),
	down_payment: z.coerce.number().min(0, "Down Payment is required"),
	yearly_raise: z.coerce.number().min(0, "Yearly Raise is required"),
	installment: z.coerce.number().min(0, "Installment is required"),
	interest: z.coerce.number().min(0, "Interest is required"),
});

export const createContractSchema = z.discriminatedUnion("type", [
	rentingContractSchema,
	lendingContractSchema,
]);

export const updateContractSchema = z.discriminatedUnion("type", [
	rentingContractSchema.partial().extend({
		id: idSchema,
		type: z.literal("renting"),
	}),
	lendingContractSchema.partial().extend({
		id: idSchema,
		type: z.literal("lending"),
	}),
]);

export const deleteContractSchema = deleteByIdSchema;

export const createRentUpdateSchema = z.object({
	rent: z.coerce.number().min(0, "Rent is required"),
	update_date: z.string().min(1, "Update Date is required"),
});

export const createInstallmentUpdateSchema = z.object({
	installment: z.coerce.number().min(0, "Installment is required"),
	interest: z.coerce.number().min(0, "Interest is required"),
	update_date: z.string().min(1, "Update Date is required"),
});

export const createDueNoteSchema = z.object({
	due_date: z.string().min(1, "Due date is required"),
	value: z.coerce.number().min(0, "Value is required"),
});

export const createRentPaymentSchema = z.object({
	date: z.string().min(1, "Date is required"),
	value: z.coerce.number().min(1, "Value is required"),
	description: z.string().nullish(),
});

export const createInstallmentPaymentSchema = z
	.object({
		date: z.string().min(1, "Date is required"),
		value: z.coerce.number().min(0, "Value is required"),
		amortization: z.coerce.number(),
		interest: z.coerce.number().min(0, "Interest is required"),
		description: z.string().nullish(),
	})
	.refine((data) => data.amortization + data.interest === data.value, {
		message:
			"The sum of amortization and interest must be equal to the value",
		path: ["value"],
	});

export const contractAccountItemSchema = z.object({
	id: idSchema,
	date: z.string().min(1, "Date is required"),
	value: z.coerce.number(),
	type: contractAccountTypeSchema,
});

export type CreateContractSchema = typeof createContractSchema;
export type UpdateContractSchema = typeof updateContractSchema;
export type DeleteContractSchema = typeof deleteContractSchema;
export type CreateRentUpdateSchema = typeof createRentUpdateSchema;
export type CreateInstallmentUpdateSchema =
	typeof createInstallmentUpdateSchema;
export type CreateDueNoteSchema = typeof createDueNoteSchema;
export type CreateRentPaymentSchema = typeof createRentPaymentSchema;
export type CreateInstallmentPaymentSchema =
	typeof createInstallmentPaymentSchema;
export type ContractAccountItemSchema = typeof contractAccountItemSchema;
