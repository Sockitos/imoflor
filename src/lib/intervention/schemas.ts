import { deleteByIdSchema, idSchema } from "@/shared/schemas";
import { z } from "zod";
import { interventionStatusValues, interventionTypeValues } from "./types";

export const interventionTypeSchema = z.enum(interventionTypeValues);
export const interventionStatusSchema = z.enum(interventionStatusValues);

const interventionSchema = z.object({
	type: interventionTypeSchema,
	status: interventionStatusSchema,
	start_date: z.string().nullish(),
	end_date: z.string().nullish(),
	description: z.string().min(1, "Description is required"),
	property_id: idSchema,
	ticket_id: idSchema.nullish(),
});

export const createInterventionSchema = interventionSchema;

export const updateInterventionSchema = interventionSchema.partial().extend({
	id: idSchema,
});

export const deleteInterventionSchema = deleteByIdSchema;

export const interventionPaymentSchema = z.object({
	id: idSchema,
	intervention_id: idSchema,
	movement_id: idSchema,
});

export type CreateInterventionSchema = typeof createInterventionSchema;
export type UpdateInterventionSchema = typeof updateInterventionSchema;
export type DeleteInterventionSchema = typeof deleteInterventionSchema;
export type InterventionPaymentSchema = typeof interventionPaymentSchema;
