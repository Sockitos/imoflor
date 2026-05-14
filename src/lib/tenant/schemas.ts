import {
	addressSchema,
	deleteByIdSchema,
	genderSchema,
	idSchema,
	maritalStatusSchema,
} from "@/shared/schemas";
import { z } from "zod";

const tenantSchema = z.object({
	name: z.string().min(1, "Name is required"),
	gender: genderSchema,
	marital_status: maritalStatusSchema,
	nationality: z.string().min(1, "Nationality is required"),
	birth_date: z.string().nullish(),
	id_type: z.string().min(1, "ID Type is required"),
	id_expiration_date: z.string().nullish(),
	id_number: z.string().min(1, "ID Number is required"),
	tax_id_number: z.string().min(1, "Tax ID Number is required"),
	address: addressSchema,
	email: z.string().nullish(),
	mobile: z.string().nullish(),
	phone: z.string().nullish(),
});

export const createTenantSchema = tenantSchema;

export const updateTenantSchema = tenantSchema.extend({
	id: idSchema,
});

export const deleteTenantSchema = deleteByIdSchema;

export type CreateTenantSchema = typeof createTenantSchema;
export type UpdateTenantSchema = typeof updateTenantSchema;
export type DeleteTenantSchema = typeof deleteTenantSchema;
