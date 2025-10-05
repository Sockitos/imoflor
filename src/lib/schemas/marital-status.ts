import { z } from 'zod';

export const maritalStatus = ['single', 'married', 'union', 'divorced', 'widowed'] as const;
export const maritalStatusOptions = {
	single: 'Single',
	married: 'Married',
	union: 'Union',
	divorced: 'Divorced',
	widowed: 'Widowed',
};
export const maritalStatusSchema = z.enum(maritalStatus).default('single');
