import { z } from 'zod';

export const createEmployeeSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	nif: z.string(),
	gender: z.enum(['male', 'female', 'other']),
	marital_status: z.enum(['single', 'married', 'union', 'divorced', 'widowed']),
	nationality: z.string(),
	birth_date: z.date().optional(),
	id_type: z.string().optional(),
	id_expiration_date: z.date().optional(),
	id_number: z.string().optional(),
	ss_number: z.string().optional().optional(),
	country: z.string().optional(),
	region: z.string().optional(),
	address: z.string().optional(),
	postal_code: z.string().optional(),
	city: z.string().optional(),
	email: z.string().optional(),
	mobile: z.string().optional(),
	phone: z.string().optional().optional(),
	position: z.string(),
	salary_type: z.enum(['hourly', 'monthly']),
	salary: z.number(),
});

export type CreateEmployeeSchema = typeof createEmployeeSchema;

export const updateEmployeeSchema = z.object({
	id: z.string(),
	name: z.string(),
	nif: z.string(),
	gender: z.enum(['male', 'female', 'other']),
	marital_status: z.enum(['single', 'married', 'union', 'divorced', 'widowed']),
	nationality: z.string(),
	birth_date: z.date().optional(),
	id_type: z.string().optional(),
	id_expiration_date: z.date().optional(),
	id_number: z.string().optional(),
	ss_number: z.string().optional().optional(),
	country: z.string().optional(),
	region: z.string().optional(),
	address: z.string().optional(),
	postal_code: z.string().optional(),
	city: z.string().optional(),
	email: z.string().optional(),
	mobile: z.string().optional(),
	phone: z.string().optional().optional(),
	position: z.string(),
	salary_type: z.enum(['hourly', 'monthly']),
	salary: z.number(),
});

export type UpdateEmployeeSchema = typeof updateEmployeeSchema;

export const deleteEmployeeSchema = z.object({
	id: z.string(),
});

export type DeleteEmployeeSchema = typeof deleteEmployeeSchema;
