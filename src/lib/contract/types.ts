import type { Id, IdAndLabel, Timestamp } from '@/shared/types';

export const contractTypeValues = ['renting', 'lending'] as const;
export type ContractType = (typeof contractTypeValues)[number];

export type BaseContract = {
	id: Id;
	property: IdAndLabel;
	tenants: IdAndLabel[];
	start_date: Timestamp;
	end_date: Timestamp | null;
	balance: number;
	type: ContractType;
};

export type RentUpdate = {
	id: number;
	rent: number;
	update_date: Timestamp;
};

export type RentingContractData = {
	type: 'renting';
	data: { rent: number; next_update: RentUpdate | null };
};

export type RentingContract = BaseContract & RentingContractData;

export type InstallmentUpdate = {
	id: number;
	installment: number;
	interest: number;
	update_date: string;
};
export type LendingContractData = {
	type: 'lending';
	data: {
		sale_value: number;
		down_payment: number;
		yearly_raise: number;
		debt: number;
		extra_debt: number;
		last_payment_date: Timestamp | null;
		installment: number;
		interest: number;
		next_update: InstallmentUpdate | null;
	};
};

export type LendingContract = BaseContract & LendingContractData;

export type Contract = RentingContract | LendingContract;

export const contractAccountTypeValues = ['due_note', 'payment'] as const;
export type ContractAccountType = (typeof contractAccountTypeValues)[number];

export type ContractAccountItem = {
	id: Id;
	date: Timestamp;
	value: number;
	type: ContractAccountType;
};
