import { z } from 'zod';

export const gender = ['male', 'female', 'other'] as const;
export const genderOptions = {
	male: 'Male',
	female: 'Female',
	other: 'Other',
};
export const genderSchema = z.enum(gender).default('male');
