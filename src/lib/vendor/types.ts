import type { Address, Id } from "@/shared/types";

export type Vendor = {
	id: Id;
	name: string;
	tax_id_number: string;
	description?: string | null;
	tags: string[];
	address: Address;
	website?: string | null;
	email?: string | null;
	mobile?: string | null;
	phone?: string | null;
};
