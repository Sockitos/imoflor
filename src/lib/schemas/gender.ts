import { z } from 'zod';

export const genderOptions = {
	male: 'Male',
	female: 'Female',
	other: 'Other',
};

type Gender = keyof typeof genderOptions;

export const genderSchema = z
	.enum(['', ...(Object.keys(genderOptions) as [Gender, ...Gender[]])])
	.refine((value) => value !== '', {
		message: 'Gender is required',
	});
