import { deleteByIdSchema, idSchema } from "@/shared/schemas";
import { z } from "zod";
import { movementTypeValues } from "./types";

export const movementTypeSchema = z.enum(movementTypeValues);

const movementSchema = z.object({
	type: movementTypeSchema,
	date: z.string().min(1, "Date is required"),
	value: z.coerce.number(),
	description: z.string().nullish(),
	tax_id_number: z.string().nullish(),
});

export const createMovementSchema = movementSchema;

export const updateMovementSchema = movementSchema.partial().extend({
	id: idSchema,
});

export const deleteMovementSchema = deleteByIdSchema;

export type CreateMovementSchema = typeof createMovementSchema;
export type UpdateMovementSchema = typeof updateMovementSchema;
export type DeleteMovementSchema = typeof deleteMovementSchema;
