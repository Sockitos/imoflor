export type UserRole = 'admin' | 'manager' | 'viewer';

export type Gender = 'male' | 'female' | 'other';

export type MaritalStatus = 'single' | 'married' | 'union' | 'divorced' | 'widowed';

export type PropertyClass = 'urban' | 'rustic';

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
	| 'intervention'
	| 'other';

export type IdWithLabel = { id: number; label: string };

export interface Profile {
	id: string;
	email: string;
	display_name: string;
	image?: string | null;
}

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

export interface Property {
	id: number;
	class: PropertyClass;
	type: PropertyType;
	is_multi_unit: boolean;
	matrix: string;
	conservatory: string;
	area?: number | null;
	tipology?: string | null;
	description?: string | null;
	patrimonial_value?: number | null;
	market_value?: number | null;
	country: string;
	region: string;
	address: string;
	postal_code: string;
	city: string;
	sold: boolean;
}

export interface Fraction {
	id: number;
	property_id: number;
	type: FractionType;
	matrix: string;
	area?: number | null;
	tipology?: string | null;
	description?: string | null;
	patrimonial_value?: number | null;
	market_value?: number | null;
	address: string;
	sold: boolean;
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

export interface RentingContractData {
	type: 'renting';
	data: { rent: number; next_update: RentUpdate | null };
}

export interface RentUpdate {
	id: number;
	rent: number;
	update_date: string;
}

export interface LendingContractData {
	type: 'lending';
	data: {
		sale_value: number;
		down_payment: number;
		yearly_raise: number;
		debt: number;
		extra_debt: number;
		last_payment_date: string | null;
		installment: number;
		interest: number;
		next_update: InstallmentUpdate | null;
	};
}

export interface InstallmentUpdate {
	id: number;
	installment: number;
	interest: number;
	update_date: string;
}

export type LendingContract = BaseContract & LendingContractData;

export type RentingContract = BaseContract & RentingContractData;

export type Contract = RentingContract | LendingContract;

export type ContractAccountType = 'due_note' | 'payment';

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
	start_date?: string | null;
	end_date?: string | null;
	description: string;
	property: IdWithLabel;
	fraction?: IdWithLabel | null;
	ticket?: IdWithLabel | null;
}

export interface Employee {
	id: number;
	name: string;
	gender: Gender;
	marital_status: MaritalStatus;
	nationality: string;
	birth_date?: string | null;
	id_type: string;
	id_expiration_date?: string | null;
	id_number: string;
	tax_id_number: string;
	ss_number: string;
	country?: string | null;
	region?: string | null;
	address?: string | null;
	postal_code?: string | null;
	city?: string | null;
	email?: string | null;
	phone?: string | null;
	mobile?: string | null;
	position: string;
	salary_type: SalaryType;
	salary: number;
}

export interface Vendor {
	id: number;
	name: string;
	tax_id_number: string;
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
	tax_id_number: string;
}
