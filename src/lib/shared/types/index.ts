export type Id = number;
export type Timestamp = string;

export const genderValues = ['male', 'female', 'other'] as const;
export const genderOptions = {
	male: 'Male',
	female: 'Female',
	other: 'Other',
};
export type Gender = (typeof genderValues)[number];

export const maritalStatusValues = ['single', 'married', 'union', 'divorced', 'widowed'] as const;
export const maritalStatusOptions = {
	single: 'Single',
	married: 'Married',
	union: 'Union',
	divorced: 'Divorced',
	widowed: 'Widowed',
};
export type MaritalStatus = (typeof maritalStatusValues)[number];

export type Address = {
	id: Id;
	address: string;
	city: string;
	country: string;
	postal_code: string;
	region: string;
};

export type IdAndLabel = {
	id: Id;
	label: string;
};

export type EntityOption = {
	id: Id;
};
