import type { Address, Gender, MaritalStatus, Timestamp } from '@/shared/types';

export type Tenant = {
	id: number;
	name: string;
	gender: Gender;
	marital_status: MaritalStatus;
	nationality: string;
	birth_date?: Timestamp | null;
	id_type: string;
	id_number: string;
	id_expiration_date?: Timestamp | null;
	tax_id_number: string;
	address: Address;
	email?: string | null;
	mobile?: string | null;
	phone?: string | null;
};
