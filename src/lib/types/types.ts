export type UserRole = 'admin' | 'manager' | 'viewer';

export type Gender = 'male' | 'female' | 'other';

export type MaritalStatus = 'single' | 'married' | 'union' | 'divorced' | 'widowed';

export type PropertyType = 'building' | 'terrain' | 'house' | 'garages';

export type FractionType = 'apartment' | 'store' | 'garage' | 'house' | 'terrain';

export type ContractType = 'renting' | 'lending';

export type TicketPriority = 'low' | 'medium' | 'high';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'cancelled';

export type InterventionType = 'new' | 'renovation' | 'maintenance';

export type InterventionStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled';

export type SalaryType = 'hourly' | 'monthly';

export type MovementType =
	| 'rent'
	| 'installment_amortization'
	| 'installment_interest'
	| 'installment_extra_amortization'
	| 'intervention'
	| 'other';

export type IdWithLabel = { id: number; label: string };

export interface User {
	id: string;
	role: UserRole;
	display_name: string;
	imagePath: string;
}

export interface Tenant {
	id: number;
	name: string;
	nif: string;
	gender: Gender;
	marital_status: MaritalStatus;
	nationality: string;
	birth_date?: string | null;
	id_type?: string | null;
	id_number?: string | null;
	id_expiration_date?: string | null;
	ss_number?: string | null;
	country?: string | null;
	region?: string | null;
	address?: string | null;
	postal_code?: string | null;
	city?: string | null;
	email?: string | null;
	phone?: string | null;
}

export interface Property {
	id: number;
	type: PropertyType;
	is_multi_unit: boolean;
	matrix: string;
	sold: boolean;
	area?: number | null;
	tipology?: string | null;
	description?: string | null;
	conservatory?: string | null;
	patrimonial_value?: number | null;
	market_value?: number | null;
	country?: string | null;
	region?: string | null;
	address?: string | null;
	postal_code?: string | null;
	city?: string | null;
}

export interface Fraction {
	id: number;
	type: FractionType;
	matrix: string;
	sold: boolean;
	area?: number | null;
	tipology?: string | null;
	description?: string | null;
	conservatory?: string | null;
	patrimonial_value?: number | null;
	market_value?: number | null;
	address?: string | null;
}

export interface BaseContract {
	id: number;
	fraction: IdWithLabel;
	tenants: IdWithLabel[];
	start_date: string;
	end_date: string | null;
	balance: number;
	type: ContractType;
}

export interface RentingContract {
	type: 'renting';
	data: { rent: number; next_update: { update_date: string; rent: number } | null };
}

export interface LendingContract {
	type: 'lending';
	data: {
		sale_value: number;
		down_payment: number;
		yearly_raise: number;
		installment: number;
		tax: number;
	};
}

export type Contract = BaseContract & (RentingContract | LendingContract);

export type ContractAccountType = 'due_note' | 'rent_payment' | 'installment_payment';

export type ContractAccountItem = {
	id: number;
	date: string;
	value: number;
	type: ContractAccountType;
};

export interface Ticket {
	id: number;
	date: string;
	priority: TicketPriority;
	status: TicketStatus;
	title: string;
	description: string;
	property: IdWithLabel;
	fraction?: IdWithLabel | null;
}

export interface Intervention {
	id: number;
	type: InterventionType;
	status: InterventionStatus;
	start_date: string;
	end_date?: string | null;
	description: string;
	property: IdWithLabel;
	fraction?: IdWithLabel | null;
	ticket?: IdWithLabel | null;
}

export interface Employee {
	id: number;
	name: string;
	nif: string;
	gender: Gender;
	marital_status: MaritalStatus;
	nationality: string;
	birth_date?: string | null;
	id_type?: string | null;
	id_number?: string | null;
	id_expiration_date?: string | null;
	ss_number?: string | null;
	country?: string | null;
	region?: string | null;
	address?: string | null;
	postal_code?: string | null;
	city?: string | null;
	email?: string | null;
	phone?: string | null;
	position: string;
	salary_type: SalaryType;
	salary: number;
}

export interface Vendor {
	id: number;
	name: string;
	nif: string;
	description?: string | null;
	tags: string[];
	country?: string | null;
	region?: string | null;
	address?: string | null;
	postal_code?: string | null;
	city?: string | null;
	website?: string | null;
	email?: string | null;
	mobile?: string | null;
	phone?: string | null;
}

export interface Movement {
	id: number;
	type: MovementType;
	date: string;
	value: number;
	description: string;
	nif: string;
}
