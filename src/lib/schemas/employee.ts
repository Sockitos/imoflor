import { z } from 'zod';
import { genderSchema } from './gender';
import { maritalStatusSchema } from './marital-status';

export const salaryType = ['hourly', 'monthly'] as const;
export const salaryTypeOptions = {
	hourly: 'Hourly',
	monthly: 'Monthly',
};
export const salaryTypeSchema = z.enum(salaryType).default('hourly');

export const createEmployeeSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	gender: genderSchema,
	marital_status: maritalStatusSchema,
	nationality: z.string().min(1, 'Nationality is required'),
	birth_date: z.string().nullish(),
	id_type: z.string().min(1, 'ID Type is required'),
	id_expiration_date: z.string().nullish(),
	id_number: z.string().min(1, 'ID Number is required'),
	tax_id_number: z.string().min(1, 'Fiscal Number is required'),
	ss_number: z.string().min(1, 'SS Number is required'),
	country: z.string().nullish(),
	region: z.string().nullish(),
	address: z.string().nullish(),
	postal_code: z.string().nullish(),
	city: z.string().nullish(),
	email: z.string().nullish(),
	mobile: z.string().nullish(),
	phone: z.string().nullish(),
	position: z.string().min(1, 'Position is required.'),
	salary_type: salaryTypeSchema,
	salary: z.coerce.number(),
});

export type CreateEmployeeSchema = typeof createEmployeeSchema;

export const deleteEmployeeSchema = z.object({
	id: z.number(),
});

export type DeleteEmployeeSchema = typeof deleteEmployeeSchema;
