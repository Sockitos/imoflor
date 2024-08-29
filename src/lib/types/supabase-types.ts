import type { MergeDeep } from 'type-fest';
import type { Database as DatabaseGenerated, Json } from './supabase-types.gen.ts';

export type Database = MergeDeep<
	DatabaseGenerated,
	{
		public: {
			Views: {
				contracts_accounts_view: {
					Row: {
						contract_id: number;
						date: string;
						id: number;
						type: string;
						value: number;
					};
				};
				contracts_balances_view: {
					Row: {
						balance: number;
						contract_id: number;
					};
				};
				contracts_view: {
					Row: {
						balance: number;
						data: Json;
						end_date: string | null;
						fraction_id: number;
						id: number;
						inserted_at: string;
						is_active: boolean;
						start_date: string;
						type: Database['public']['Enums']['contract_type'];
					};
				};
				fractions_view: {
					Row: {
						address: string;
						address_full: string;
						area: number | null;
						city: string | null;
						conservatory: string | null;
						country: string | null;
						description: string | null;
						id: number;
						inserted_at: string;
						market_value: number | null;
						matrix: string;
						patrimonial_value: number | null;
						postal_code: string | null;
						property_id: number;
						region: string | null;
						sold: boolean;
						tipology: string | null;
						type: Database['public']['Enums']['fraction_type'];
					};
				};
				installment_payments_view: {
					Row: {
						amortization: number;
						contract_id: number;
						date: string;
						description: string;
						extra_amortization: number;
						extra_debt: number;
						id: number;
						interest: number;
					};
				};
				intervention_payments_view: {
					Row: {
						date: string;
						description: string;
						id: number;
						intervention_id: number;
						value: number;
					};
				};
				lending_contracts_debts_view: {
					Row: {
						debt: number;
						extra_debt: number;
						id: number;
						last_payment_date: string;
					};
				};
				lending_contracts_view: {
					Row: {
						contract_type: Database['public']['Enums']['contract_type'] | null;
						debt: number;
						down_payment: number;
						extra_debt: number;
						id: number;
						inserted_at: string;
						installment: number;
						last_payment_date: string | null;
						next_update: Json | null;
						sale_value: number;
						tax: number;
						yearly_raise: number;
					};
				};
				rent_payments_view: {
					Row: {
						contract_id: number;
						date: string;
						description: string;
						id: number;
						value: number;
					};
				};
				renting_contracts_view: {
					Row: {
						contract_type: Database['public']['Enums']['contract_type'];
						id: number;
						inserted_at: string;
						next_update: Json | null;
						rent: number;
					};
				};
			};
		};
	}
>;
