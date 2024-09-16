import { z } from 'zod';

export const maritalStatusOptions = {
	single: 'Single',
	married: 'Married',
	union: 'Union',
	divorced: 'Divorced',
	widowed: 'Widowed',
};

type MaritalStatus = keyof typeof maritalStatusOptions;

export const maritalStatusSchema = z
	.enum(['', ...(Object.keys(maritalStatusOptions) as [MaritalStatus, ...MaritalStatus[]])])
	.refine((value) => value !== '', {
		message: 'Marital status is required',
	});
