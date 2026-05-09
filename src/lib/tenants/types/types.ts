import type { Gender, MaritalStatus } from '@/types/types';

export interface Tenant {
	id: number;
	name: string;
	gender: Gender;
	marital_status: MaritalStatus;
	nationality: string;
	birth_date?: string | null;
	id_type: string;
	id_number: string;
	id_expiration_date?: string | null;
	tax_id_number: string;
	country?: string | null;
	region?: string | null;
	address?: string | null;
	postal_code?: string | null;
	city?: string | null;
	email?: string | null;
	mobile?: string | null;
	phone?: string | null;
}
