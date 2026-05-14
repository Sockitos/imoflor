import type {
	Address,
	Gender,
	Id,
	MaritalStatus,
	Timestamp,
} from "@/shared/types";

export const salaryTypeValues = ["hourly", "monthly"] as const;
export const salaryTypeOptions = {
	hourly: "Hourly",
	monthly: "Monthly",
};
export type SalaryType = (typeof salaryTypeValues)[number];

export type Employee = {
	id: Id;
	name: string;
	gender: Gender;
	marital_status: MaritalStatus;
	nationality: string;
	birth_date?: Timestamp | null;
	id_type: string;
	id_expiration_date?: Timestamp | null;
	id_number: string;
	tax_id_number: string;
	ss_number: string;
	address: Address;
	email?: string | null;
	phone?: string | null;
	mobile?: string | null;
	position: string;
	salary_type: SalaryType;
	salary: number;
};
