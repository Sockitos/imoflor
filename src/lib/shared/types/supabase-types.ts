import type { MergeDeep } from 'type-fest';
import type { Database as DatabaseGenerated, Json } from './supabase-types.gen.ts';

/** Audit columns are filled by DB triggers from auth.uid(). */
type OptionalAuditInsert = {
	created_by?: string;
	updated_by?: string;
};

export type Database = MergeDeep<
	DatabaseGenerated,
	{
		public: {
			Tables: {
				addresses: { Insert: OptionalAuditInsert };
				properties: { Insert: OptionalAuditInsert };
				tenants: { Insert: OptionalAuditInsert };
				employees: { Insert: OptionalAuditInsert };
				vendors: { Insert: OptionalAuditInsert };
				tickets: { Insert: OptionalAuditInsert };
				interventions: { Insert: OptionalAuditInsert };
				due_notes: { Insert: OptionalAuditInsert };
				rent_updates: { Insert: OptionalAuditInsert };
				installment_updates: { Insert: OptionalAuditInsert };
				contracts: { Insert: OptionalAuditInsert };
			};
			Views: {
				contracts_accounts_view: {
					Row: {
						balance: number;
						contract_id: number;
						description: string | null;
						id: number;
						is_scheduled: boolean;
						occurred_at: string;
						type: 'due_note' | 'rent_payment' | 'installment_payment';
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
						created_at: string;
						data: Json;
						end_date: string | null;
						property_id: number;
						id: number;
						is_active: boolean;
						start_date: string;
						type: DatabaseGenerated['public']['Enums']['contract_type'];
					};
					Insert: {
						data: Json;
						end_date?: string | null;
						property_id: number;
						id?: number;
						is_active?: boolean;
						start_date: string;
						type: DatabaseGenerated['public']['Enums']['contract_type'];
					};
					Update: {
						data?: Json;
						end_date?: string | null;
						property_id?: number;
						id?: number;
						is_active?: boolean;
						start_date?: string;
						type?: DatabaseGenerated['public']['Enums']['contract_type'];
					};
				};
				installment_payments_view: {
					Row: {
						amortization: number;
						contract_id: number;
						occurred_at: string;
						description: string | null;
						extra_debt: number;
						id: number;
						interest: number;
					};
					Insert: {
						amortization: number;
						contract_id: number;
						occurred_at: string;
						description?: string | null;
						extra_debt: number;
						id?: number;
						interest: number;
					};
					Update: {
						amortization?: number;
						contract_id?: number;
						occurred_at?: string;
						description?: string | null;
						extra_debt?: number;
						id?: number;
						interest?: number;
					};
				};
				intervention_expenses_view: {
					Row: {
						occurred_at: string;
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
						last_paid_at: string;
					};
				};
				lending_contracts_view: {
					Row: {
						contract_type: DatabaseGenerated['public']['Enums']['contract_type'] | null;
						debt: number;
						down_payment: number;
						extra_debt: number;
						id: number;
						created_at: string;
						installment: number;
						interest: number;
						last_paid_at: string | null;
						next_update: Json | null;
						sale_value: number;
						yearly_raise: number;
					};
				};
				rent_payments_view: {
					Row: {
						contract_id: number;
						occurred_at: string;
						description: string | null;
						id: number;
						value: number;
					};
					Insert: {
						contract_id: number;
						occurred_at: string;
						description?: string | null;
						id?: number;
						value: number;
					};
					Update: {
						contract_id?: number;
						occurred_at?: string;
						description?: string | null;
						id?: number;
						value?: number;
					};
				};
				renting_contracts_view: {
					Row: {
						contract_type: DatabaseGenerated['public']['Enums']['contract_type'];
						id: number;
						created_at: string;
						next_update: Json | null;
						rent: number;
					};
				};
			};
		};
	}
>;
