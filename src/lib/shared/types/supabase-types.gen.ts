export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string
          created_by: string
          id: number
          postal_code: string
          region: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string
          created_by: string
          id?: never
          postal_code: string
          region: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          created_by?: string
          id?: never
          postal_code?: string
          region?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          created_at: string
          created_by: string
          end_date: string | null
          id: number
          is_active: boolean
          property_id: number
          start_date: string
          type: Database["public"]["Enums"]["contract_type"]
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          created_by: string
          end_date?: string | null
          id?: never
          is_active?: boolean
          property_id: number
          start_date: string
          type: Database["public"]["Enums"]["contract_type"]
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          created_by?: string
          end_date?: string | null
          id?: never
          is_active?: boolean
          property_id?: number
          start_date?: string
          type?: Database["public"]["Enums"]["contract_type"]
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contracts_property_id"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts_tenants: {
        Row: {
          contract_id: number
          created_at: string
          created_by: string
          tenant_id: number
          updated_at: string
          updated_by: string
        }
        Insert: {
          contract_id: number
          created_at?: string
          created_by: string
          tenant_id: number
          updated_at?: string
          updated_by: string
        }
        Update: {
          contract_id?: number
          created_at?: string
          created_by?: string
          tenant_id?: number
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_tenants_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_tenants_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contracts_tenants_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contracts_tenants_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts_balances_view"
            referencedColumns: ["contract_id"]
          },
          {
            foreignKeyName: "fk_contracts_tenants_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contracts_tenants_tenant_id"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      due_notes: {
        Row: {
          contract_id: number
          created_at: string
          created_by: string
          due_date: string
          id: number
          is_scheduled: boolean
          updated_at: string
          updated_by: string
          value: number
        }
        Insert: {
          contract_id: number
          created_at?: string
          created_by: string
          due_date: string
          id?: never
          is_scheduled?: boolean
          updated_at?: string
          updated_by: string
          value: number
        }
        Update: {
          contract_id?: number
          created_at?: string
          created_by?: string
          due_date?: string
          id?: never
          is_scheduled?: boolean
          updated_at?: string
          updated_by?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "due_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "due_notes_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_due_notes_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_due_notes_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts_balances_view"
            referencedColumns: ["contract_id"]
          },
          {
            foreignKeyName: "fk_due_notes_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts_view"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address_id: number
          birth_date: string | null
          created_at: string
          created_by: string
          email: string | null
          gender: Database["public"]["Enums"]["gender"]
          id: number
          id_expiration_date: string | null
          id_number: string
          id_type: string
          marital_status: Database["public"]["Enums"]["marital_status"]
          mobile: string | null
          name: string
          nationality: string
          phone: string | null
          position: string
          salary: number
          salary_type: Database["public"]["Enums"]["salary_type"]
          ss_number: string
          tax_id_number: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          address_id: number
          birth_date?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          gender: Database["public"]["Enums"]["gender"]
          id?: never
          id_expiration_date?: string | null
          id_number: string
          id_type: string
          marital_status: Database["public"]["Enums"]["marital_status"]
          mobile?: string | null
          name: string
          nationality: string
          phone?: string | null
          position: string
          salary: number
          salary_type: Database["public"]["Enums"]["salary_type"]
          ss_number: string
          tax_id_number: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          address_id?: number
          birth_date?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          gender?: Database["public"]["Enums"]["gender"]
          id?: never
          id_expiration_date?: string | null
          id_number?: string
          id_type?: string
          marital_status?: Database["public"]["Enums"]["marital_status"]
          mobile?: string | null
          name?: string
          nationality?: string
          phone?: string | null
          position?: string
          salary?: number
          salary_type?: Database["public"]["Enums"]["salary_type"]
          ss_number?: string
          tax_id_number?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_employees_address_id"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      installment_payments: {
        Row: {
          amortization_movement_id: number | null
          contract_id: number
          created_at: string
          created_by: string
          extra_debt: number | null
          id: number
          interest_movement_id: number
          updated_at: string
          updated_by: string
        }
        Insert: {
          amortization_movement_id?: number | null
          contract_id: number
          created_at?: string
          created_by: string
          extra_debt?: number | null
          id?: never
          interest_movement_id: number
          updated_at?: string
          updated_by: string
        }
        Update: {
          amortization_movement_id?: number | null
          contract_id?: number
          created_at?: string
          created_by?: string
          extra_debt?: number | null
          id?: never
          interest_movement_id?: number
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_installment_payments_amortization_movement_id"
            columns: ["amortization_movement_id"]
            isOneToOne: false
            referencedRelation: "movements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_installment_payments_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_installment_payments_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts_debts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_installment_payments_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_installment_payments_interest_movement_id"
            columns: ["interest_movement_id"]
            isOneToOne: false
            referencedRelation: "movements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_payments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      installment_updates: {
        Row: {
          contract_id: number
          created_at: string
          created_by: string
          id: number
          installment: number
          interest: number
          update_date: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          contract_id: number
          created_at?: string
          created_by: string
          id?: never
          installment: number
          interest: number
          update_date: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          contract_id?: number
          created_at?: string
          created_by?: string
          id?: never
          installment?: number
          interest?: number
          update_date?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_installment_updates_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_installment_updates_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts_debts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_installment_updates_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_updates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_updates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      intervention_expenses: {
        Row: {
          created_at: string
          created_by: string
          id: number
          intervention_id: number
          movement_id: number
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: never
          intervention_id: number
          movement_id: number
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: never
          intervention_id?: number
          movement_id?: number
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_intervention_expenses_intervention_id"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_intervention_expenses_movement_id"
            columns: ["movement_id"]
            isOneToOne: false
            referencedRelation: "movements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intervention_expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intervention_expenses_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      intervention_status_history: {
        Row: {
          created_at: string
          created_by: string
          from_status: Database["public"]["Enums"]["intervention_status"] | null
          id: number
          intervention_id: number
          to_status: Database["public"]["Enums"]["intervention_status"]
        }
        Insert: {
          created_at?: string
          created_by: string
          from_status?:
            | Database["public"]["Enums"]["intervention_status"]
            | null
          id?: never
          intervention_id: number
          to_status: Database["public"]["Enums"]["intervention_status"]
        }
        Update: {
          created_at?: string
          created_by?: string
          from_status?:
            | Database["public"]["Enums"]["intervention_status"]
            | null
          id?: never
          intervention_id?: number
          to_status?: Database["public"]["Enums"]["intervention_status"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_intervention_status_history_intervention_id"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intervention_status_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      intervention_status_transitions: {
        Row: {
          from_status: Database["public"]["Enums"]["intervention_status"]
          to_status: Database["public"]["Enums"]["intervention_status"]
        }
        Insert: {
          from_status: Database["public"]["Enums"]["intervention_status"]
          to_status: Database["public"]["Enums"]["intervention_status"]
        }
        Update: {
          from_status?: Database["public"]["Enums"]["intervention_status"]
          to_status?: Database["public"]["Enums"]["intervention_status"]
        }
        Relationships: []
      }
      interventions: {
        Row: {
          created_at: string
          created_by: string
          description: string
          end_date: string | null
          id: number
          property_id: number
          rank: string
          start_date: string | null
          status: Database["public"]["Enums"]["intervention_status"]
          ticket_id: number | null
          type: Database["public"]["Enums"]["intervention_type"]
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          end_date?: string | null
          id?: never
          property_id: number
          rank: string
          start_date?: string | null
          status: Database["public"]["Enums"]["intervention_status"]
          ticket_id?: number | null
          type: Database["public"]["Enums"]["intervention_type"]
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          end_date?: string | null
          id?: never
          property_id?: number
          rank?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["intervention_status"]
          ticket_id?: number | null
          type?: Database["public"]["Enums"]["intervention_type"]
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_interventions_property_id"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_interventions_ticket_id"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lending_contracts: {
        Row: {
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at: string
          created_by: string
          down_payment: number
          id: number
          sale_value: number
          updated_at: string
          updated_by: string
          yearly_raise: number
        }
        Insert: {
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          created_by: string
          down_payment: number
          id?: never
          sale_value: number
          updated_at?: string
          updated_by: string
          yearly_raise: number
        }
        Update: {
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          created_by?: string
          down_payment?: number
          id?: never
          sale_value?: number
          updated_at?: string
          updated_by?: string
          yearly_raise?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_lending_contracts_id_contract_type"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id", "type"]
          },
          {
            foreignKeyName: "fk_lending_contracts_id_contract_type"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts_view"
            referencedColumns: ["id", "type"]
          },
          {
            foreignKeyName: "lending_contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lending_contracts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      movements: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: number
          occurred_at: string
          tax_id_number: string | null
          type: Database["public"]["Enums"]["movement_type"]
          updated_at: string
          updated_by: string
          value: number
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: never
          occurred_at: string
          tax_id_number?: string | null
          type: Database["public"]["Enums"]["movement_type"]
          updated_at?: string
          updated_by: string
          value: number
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: never
          occurred_at?: string
          tax_id_number?: string | null
          type?: Database["public"]["Enums"]["movement_type"]
          updated_at?: string
          updated_by?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movements_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          created_by: string
          display_name: string
          email: string
          id: string
          image: string | null
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          created_by: string
          display_name: string
          email: string
          id: string
          image?: string | null
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          created_by?: string
          display_name?: string
          email?: string
          id?: string
          image?: string | null
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_id"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_updated_by"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address_id: number
          area: number | null
          class: Database["public"]["Enums"]["property_class"]
          conservatory: string
          created_at: string
          created_by: string
          description: string | null
          fraction: string | null
          id: number
          market_value: number | null
          matrix: string
          parent_id: number | null
          patrimonial_value: number | null
          sold: boolean
          tipology: string | null
          type: Database["public"]["Enums"]["property_type"]
          updated_at: string
          updated_by: string
        }
        Insert: {
          address_id: number
          area?: number | null
          class: Database["public"]["Enums"]["property_class"]
          conservatory: string
          created_at?: string
          created_by: string
          description?: string | null
          fraction?: string | null
          id?: never
          market_value?: number | null
          matrix: string
          parent_id?: number | null
          patrimonial_value?: number | null
          sold?: boolean
          tipology?: string | null
          type: Database["public"]["Enums"]["property_type"]
          updated_at?: string
          updated_by: string
        }
        Update: {
          address_id?: number
          area?: number | null
          class?: Database["public"]["Enums"]["property_class"]
          conservatory?: string
          created_at?: string
          created_by?: string
          description?: string | null
          fraction?: string | null
          id?: never
          market_value?: number | null
          matrix?: string
          parent_id?: number | null
          patrimonial_value?: number | null
          sold?: boolean
          tipology?: string | null
          type?: Database["public"]["Enums"]["property_type"]
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_properties_address_id"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_properties_parent_id"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_payments: {
        Row: {
          contract_id: number
          created_at: string
          created_by: string
          id: number
          movement_id: number
          updated_at: string
          updated_by: string
        }
        Insert: {
          contract_id: number
          created_at?: string
          created_by: string
          id?: never
          movement_id: number
          updated_at?: string
          updated_by: string
        }
        Update: {
          contract_id?: number
          created_at?: string
          created_by?: string
          id?: never
          movement_id?: number
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_rent_payments_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "renting_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_rent_payments_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "renting_contracts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_rent_payments_movement_id"
            columns: ["movement_id"]
            isOneToOne: false
            referencedRelation: "movements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_payments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_updates: {
        Row: {
          contract_id: number
          created_at: string
          created_by: string
          id: number
          rent: number
          update_date: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          contract_id: number
          created_at?: string
          created_by: string
          id?: never
          rent: number
          update_date: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          contract_id?: number
          created_at?: string
          created_by?: string
          id?: never
          rent?: number
          update_date?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_rent_updates_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "renting_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_rent_updates_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "renting_contracts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_updates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_updates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      renting_contracts: {
        Row: {
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at: string
          created_by: string
          id: number
          updated_at: string
          updated_by: string
        }
        Insert: {
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          created_by: string
          id?: never
          updated_at?: string
          updated_by: string
        }
        Update: {
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          created_by?: string
          id?: never
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_renting_contracts_id_contract_type"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id", "type"]
          },
          {
            foreignKeyName: "fk_renting_contracts_id_contract_type"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts_view"
            referencedColumns: ["id", "type"]
          },
          {
            foreignKeyName: "renting_contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renting_contracts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          address_id: number
          birth_date: string | null
          created_at: string
          created_by: string
          email: string | null
          gender: Database["public"]["Enums"]["gender"]
          id: number
          id_expiration_date: string | null
          id_number: string
          id_type: string
          marital_status: Database["public"]["Enums"]["marital_status"]
          mobile: string | null
          name: string
          nationality: string
          phone: string | null
          tax_id_number: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          address_id: number
          birth_date?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          gender: Database["public"]["Enums"]["gender"]
          id?: never
          id_expiration_date?: string | null
          id_number: string
          id_type: string
          marital_status: Database["public"]["Enums"]["marital_status"]
          mobile?: string | null
          name: string
          nationality: string
          phone?: string | null
          tax_id_number: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          address_id?: number
          birth_date?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          gender?: Database["public"]["Enums"]["gender"]
          id?: never
          id_expiration_date?: string | null
          id_number?: string
          id_type?: string
          marital_status?: Database["public"]["Enums"]["marital_status"]
          mobile?: string | null
          name?: string
          nationality?: string
          phone?: string | null
          tax_id_number?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tenants_address_id"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_status_history: {
        Row: {
          created_at: string
          created_by: string
          from_status: Database["public"]["Enums"]["ticket_status"] | null
          id: number
          ticket_id: number
          to_status: Database["public"]["Enums"]["ticket_status"]
        }
        Insert: {
          created_at?: string
          created_by: string
          from_status?: Database["public"]["Enums"]["ticket_status"] | null
          id?: never
          ticket_id: number
          to_status: Database["public"]["Enums"]["ticket_status"]
        }
        Update: {
          created_at?: string
          created_by?: string
          from_status?: Database["public"]["Enums"]["ticket_status"] | null
          id?: never
          ticket_id?: number
          to_status?: Database["public"]["Enums"]["ticket_status"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_ticket_status_history_ticket_id"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_status_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_status_transitions: {
        Row: {
          from_status: Database["public"]["Enums"]["ticket_status"]
          to_status: Database["public"]["Enums"]["ticket_status"]
        }
        Insert: {
          from_status: Database["public"]["Enums"]["ticket_status"]
          to_status: Database["public"]["Enums"]["ticket_status"]
        }
        Update: {
          from_status?: Database["public"]["Enums"]["ticket_status"]
          to_status?: Database["public"]["Enums"]["ticket_status"]
        }
        Relationships: []
      }
      tickets: {
        Row: {
          created_at: string
          created_by: string
          description: string
          id: number
          priority: Database["public"]["Enums"]["ticket_priority"]
          property_id: number
          rank: string
          status: Database["public"]["Enums"]["ticket_status"]
          title: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          id?: never
          priority: Database["public"]["Enums"]["ticket_priority"]
          property_id: number
          rank: string
          status: Database["public"]["Enums"]["ticket_status"]
          title: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          id?: never
          priority?: Database["public"]["Enums"]["ticket_priority"]
          property_id?: number
          rank?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          title?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tickets_property_id"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string
          id: string
        }
        Insert: {
          email: string
          id: string
        }
        Update: {
          email?: string
          id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address_id: number
          created_at: string
          created_by: string
          description: string | null
          email: string | null
          id: number
          mobile: string | null
          name: string
          phone: string | null
          tags: string[]
          tax_id_number: string
          updated_at: string
          updated_by: string
          website: string | null
        }
        Insert: {
          address_id: number
          created_at?: string
          created_by: string
          description?: string | null
          email?: string | null
          id?: never
          mobile?: string | null
          name: string
          phone?: string | null
          tags?: string[]
          tax_id_number: string
          updated_at?: string
          updated_by: string
          website?: string | null
        }
        Update: {
          address_id?: number
          created_at?: string
          created_by?: string
          description?: string | null
          email?: string | null
          id?: never
          mobile?: string | null
          name?: string
          phone?: string | null
          tags?: string[]
          tax_id_number?: string
          updated_at?: string
          updated_by?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vendors_address_id"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      contracts_account_entries_view: {
        Row: {
          contract_id: number | null
          description: string | null
          id: number | null
          is_scheduled: boolean | null
          occurred_at: string | null
          type: string | null
          value: number | null
        }
        Relationships: []
      }
      contracts_accounts_view: {
        Row: {
          balance: number | null
          contract_id: number | null
          description: string | null
          id: number | null
          is_scheduled: boolean | null
          occurred_at: string | null
          type: string | null
          value: number | null
        }
        Relationships: []
      }
      contracts_balances_view: {
        Row: {
          balance: number | null
          contract_id: number | null
        }
        Relationships: []
      }
      contracts_view: {
        Row: {
          balance: number | null
          created_at: string | null
          created_by: string | null
          data: Json | null
          end_date: string | null
          id: number | null
          is_active: boolean | null
          property_id: number | null
          start_date: string | null
          type: Database["public"]["Enums"]["contract_type"] | null
          updated_at: string | null
          updated_by: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contracts_property_id"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      installment_payments_view: {
        Row: {
          amortization: number | null
          contract_id: number | null
          description: string | null
          extra_debt: number | null
          id: number | null
          interest: number | null
          occurred_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_installment_payments_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_installment_payments_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts_debts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_installment_payments_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts_view"
            referencedColumns: ["id"]
          },
        ]
      }
      intervention_expenses_view: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number | null
          intervention_id: number | null
          occurred_at: string | null
          updated_at: string | null
          updated_by: string | null
          value: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_intervention_expenses_intervention_id"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intervention_expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intervention_expenses_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lending_contracts_debts_view: {
        Row: {
          debt: number | null
          extra_debt: number | null
          id: number | null
          last_paid_at: string | null
        }
        Relationships: []
      }
      lending_contracts_view: {
        Row: {
          contract_type: Database["public"]["Enums"]["contract_type"] | null
          created_at: string | null
          created_by: string | null
          debt: number | null
          down_payment: number | null
          extra_debt: number | null
          id: number | null
          installment: number | null
          interest: number | null
          last_paid_at: string | null
          next_update: Json | null
          sale_value: number | null
          updated_at: string | null
          updated_by: string | null
          yearly_raise: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_lending_contracts_id_contract_type"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id", "type"]
          },
          {
            foreignKeyName: "fk_lending_contracts_id_contract_type"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts_view"
            referencedColumns: ["id", "type"]
          },
          {
            foreignKeyName: "lending_contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lending_contracts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_payments_view: {
        Row: {
          contract_id: number | null
          description: string | null
          id: number | null
          occurred_at: string | null
          value: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_rent_payments_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "renting_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_rent_payments_contract_id"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "renting_contracts_view"
            referencedColumns: ["id"]
          },
        ]
      }
      renting_contracts_view: {
        Row: {
          contract_type: Database["public"]["Enums"]["contract_type"] | null
          created_at: string | null
          created_by: string | null
          id: number | null
          next_update: Json | null
          rent: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_renting_contracts_id_contract_type"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id", "type"]
          },
          {
            foreignKeyName: "fk_renting_contracts_id_contract_type"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts_view"
            referencedColumns: ["id", "type"]
          },
          {
            foreignKeyName: "renting_contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renting_contracts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      system_user_id: { Args: never; Returns: string }
      transition_intervention: {
        Args: {
          p_intervention_id: number
          p_rank: string
          p_to_status: Database["public"]["Enums"]["intervention_status"]
        }
        Returns: {
          created_at: string
          created_by: string
          description: string
          end_date: string | null
          id: number
          property_id: number
          rank: string
          start_date: string | null
          status: Database["public"]["Enums"]["intervention_status"]
          ticket_id: number | null
          type: Database["public"]["Enums"]["intervention_type"]
          updated_at: string
          updated_by: string
        }
        SetofOptions: {
          from: "*"
          to: "interventions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      transition_ticket: {
        Args: {
          p_rank: string
          p_ticket_id: number
          p_to_status: Database["public"]["Enums"]["ticket_status"]
        }
        Returns: {
          created_at: string
          created_by: string
          description: string
          id: number
          priority: Database["public"]["Enums"]["ticket_priority"]
          property_id: number
          rank: string
          status: Database["public"]["Enums"]["ticket_status"]
          title: string
          updated_at: string
          updated_by: string
        }
        SetofOptions: {
          from: "*"
          to: "tickets"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_contract_tenants: {
        Args: { p_contract_id: number; p_tenants: number[] }
        Returns: undefined
      }
    }
    Enums: {
      contract_type: "renting" | "lending"
      gender: "male" | "female" | "other"
      intervention_status:
        | "not_started"
        | "in_progress"
        | "completed"
        | "cancelled"
      intervention_type: "new" | "renovation" | "maintenance"
      marital_status: "single" | "married" | "union" | "divorced" | "widowed"
      movement_type:
        | "rent"
        | "installment_amortization"
        | "installment_interest"
        | "intervention"
        | "other"
      property_class: "urban" | "rustic"
      property_type:
        | "building"
        | "terrain"
        | "house"
        | "garages"
        | "apartment"
        | "store"
        | "garage"
      salary_type: "hourly" | "monthly"
      ticket_priority: "low" | "medium" | "high"
      ticket_status: "open" | "in_progress" | "resolved" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      contract_type: ["renting", "lending"],
      gender: ["male", "female", "other"],
      intervention_status: [
        "not_started",
        "in_progress",
        "completed",
        "cancelled",
      ],
      intervention_type: ["new", "renovation", "maintenance"],
      marital_status: ["single", "married", "union", "divorced", "widowed"],
      movement_type: [
        "rent",
        "installment_amortization",
        "installment_interest",
        "intervention",
        "other",
      ],
      property_class: ["urban", "rustic"],
      property_type: [
        "building",
        "terrain",
        "house",
        "garages",
        "apartment",
        "store",
        "garage",
      ],
      salary_type: ["hourly", "monthly"],
      ticket_priority: ["low", "medium", "high"],
      ticket_status: ["open", "in_progress", "resolved", "cancelled"],
    },
  },
} as const

