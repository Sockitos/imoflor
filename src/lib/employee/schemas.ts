import {
	addressSchema,
	deleteByIdSchema,
	genderSchema,
	idSchema,
	maritalStatusSchema,
} from '@shared/schemas';
import { z } from 'zod';
import { salaryTypeValues } from './types';

export const salaryTypeSchema = z.enum(salaryTypeValues);

const employeeSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	gender: genderSchema,
	marital_status: maritalStatusSchema,
	nationality: z.string().min(1, 'Nationality is required'),
	birth_date: z.string().nullish(),
	id_type: z.string().min(1, 'ID Type is required'),
	id_expiration_date: z.string().nullish(),
	id_number: z.string().min(1, 'ID Number is required'),
	tax_id_number: z.string().min(1, 'Tax ID Number is required'),
	ss_number: z.string().min(1, 'SS Number is required'),
	address: addressSchema,
	email: z.string().nullish(),
	phone: z.string().nullish(),
	mobile: z.string().nullish(),
	position: z.string().min(1, 'Position is required'),
	salary_type: salaryTypeSchema,
	salary: z.coerce.number(),
});

export const createEmployeeSchema = employeeSchema;

export const updateEmployeeSchema = employeeSchema.extend({
	id: idSchema,
});

export const deleteEmployeeSchema = deleteByIdSchema;

export type CreateEmployeeSchema = typeof createEmployeeSchema;
export type UpdateEmployeeSchema = typeof updateEmployeeSchema;
export type DeleteEmployeeSchema = typeof deleteEmployeeSchema;
