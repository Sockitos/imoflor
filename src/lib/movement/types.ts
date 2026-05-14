import type { Id } from '@/shared/types';

export const movementTypeValues = [
	'rent',
	'installment_amortization',
	'installment_interest',
	'intervention',
	'other',
] as const;
export type MovementType = (typeof movementTypeValues)[number];

export type Movement = {
	id: Id;
	type: MovementType;
	date: string;
	value: number;
	description: string | null;
	tax_id_number: string | null;
};
