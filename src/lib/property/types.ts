import type { Address, Id } from '@/shared/types';

export const propertyClassValues = ['urban', 'rustic'] as const;
export const propertyClassOptions = {
	urban: 'Urban',
	rustic: 'Rustic',
};
export type PropertyClass = (typeof propertyClassValues)[number];

export const propertyTypeValues = [
	'building',
	'terrain',
	'house',
	'garages',
	'apartment',
	'store',
	'garage',
] as const;
export const propertyTypeOptions = {
	building: 'Building',
	terrain: 'Terrain',
	house: 'House',
	garages: 'Garages',
	apartment: 'Apartment',
	store: 'Store',
	garage: 'Garage',
};
export type PropertyType = (typeof propertyTypeValues)[number];

export type Property = {
	id: Id;
	class: PropertyClass;
	type: PropertyType;
	matrix: string;
	conservatory: string;
	area: number | null;
	tipology: string | null;
	description: string | null;
	patrimonial_value?: number | null;
	market_value?: number | null;
	address: Address;
	parent_id: Id | null;
	sold: boolean;
};

export const fractionTypeValues = ['apartment', 'store', 'garage'] as const;
export const fractionTypeOptions = {
	apartment: 'Apartment',
	store: 'Store',
	garage: 'Garage',
};
export type FractionType = (typeof fractionTypeValues)[number];

export type Fraction = {
	id: Id;
	class: PropertyClass;
	type: FractionType;
	matrix: string;
	conservatory: string;
	area: number | null;
	tipology: string | null;
	description: string | null;
	patrimonial_value?: number | null;
	market_value?: number | null;
	address: Address;
	fraction: string;
	parent_id: Id;
	sold: boolean;
};
