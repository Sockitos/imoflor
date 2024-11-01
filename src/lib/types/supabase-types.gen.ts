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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      contracts: {
        Row: {
          end_date: string | null
          fraction_id: number
          id: number
          inserted_at: string
          is_active: boolean
          start_date: string
          type: Database["public"]["Enums"]["contract_type"]
        }
        Insert: {
          end_date?: string | null
          fraction_id: number
          id?: number
          inserted_at?: string
          is_active?: boolean
          start_date: string
          type: Database["public"]["Enums"]["contract_type"]
        }
        Update: {
          end_date?: string | null
          fraction_id?: number
          id?: number
          inserted_at?: string
          is_active?: boolean
          start_date?: string
          type?: Database["public"]["Enums"]["contract_type"]
        }
        Relationships: [
          {
            foreignKeyName: "contracts_fraction_id_fkey"
            columns: ["fraction_id"]
            isOneToOne: false
            referencedRelation: "fractions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_fraction_id_fkey"
            columns: ["fraction_id"]
            isOneToOne: false
            referencedRelation: "fractions_view"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts_tenants: {
        Row: {
          contract_id: number
          tenant_id: number
        }
        Insert: {
          contract_id: number
          tenant_id: number
        }
        Update: {
          contract_id?: number
          tenant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "contracts_tenants_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_tenants_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts_balances_view"
            referencedColumns: ["contract_id"]
          },
          {
            foreignKeyName: "contracts_tenants_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_tenants_tenant_id_fkey"
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
          due_date: string
          id: number
          inserted_at: string
          value: number
        }
        Insert: {
          contract_id: number
          due_date: string
          id?: number
          inserted_at?: string
          value: number
        }
        Update: {
          contract_id?: number
          due_date?: string
          id?: number
          inserted_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "due_notes_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "due_notes_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts_balances_view"
            referencedColumns: ["contract_id"]
          },
          {
            foreignKeyName: "due_notes_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts_view"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          birth_date: string | null
          city: string | null
          country: string | null
          email: string | null
          gender: Database["public"]["Enums"]["gender"]
          id: number
          id_expiration_date: string | null
          id_number: string
          id_type: string
          inserted_at: string
          marital_status: Database["public"]["Enums"]["marital_status"]
          mobile: string | null
          name: string
          nationality: string
          phone: string | null
          position: string
          postal_code: string | null
          region: string | null
          salary: number
          salary_type: Database["public"]["Enums"]["salary_type"]
          ss_number: string
          tax_id_number: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          email?: string | null
          gender: Database["public"]["Enums"]["gender"]
          id?: number
          id_expiration_date?: string | null
          id_number: string
          id_type: string
          inserted_at?: string
          marital_status: Database["public"]["Enums"]["marital_status"]
          mobile?: string | null
          name: string
          nationality: string
          phone?: string | null
          position: string
          postal_code?: string | null
          region?: string | null
          salary: number
          salary_type: Database["public"]["Enums"]["salary_type"]
          ss_number: string
          tax_id_number: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          email?: string | null
          gender?: Database["public"]["Enums"]["gender"]
          id?: number
          id_expiration_date?: string | null
          id_number?: string
          id_type?: string
          inserted_at?: string
          marital_status?: Database["public"]["Enums"]["marital_status"]
          mobile?: string | null
          name?: string
          nationality?: string
          phone?: string | null
          position?: string
          postal_code?: string | null
          region?: string | null
          salary?: number
          salary_type?: Database["public"]["Enums"]["salary_type"]
          ss_number?: string
          tax_id_number?: string
        }
        Relationships: []
      }
      fractions: {
        Row: {
          address: string
          area: number | null
          description: string | null
          id: number
          inserted_at: string
          market_value: number | null
          matrix: string
          patrimonial_value: number | null
          property_id: number
          sold: boolean
          tipology: string | null
          type: Database["public"]["Enums"]["fraction_type"]
        }
        Insert: {
          address: string
          area?: number | null
          description?: string | null
          id?: number
          inserted_at?: string
          market_value?: number | null
          matrix: string
          patrimonial_value?: number | null
          property_id: number
          sold?: boolean
          tipology?: string | null
          type: Database["public"]["Enums"]["fraction_type"]
        }
        Update: {
          address?: string
          area?: number | null
          description?: string | null
          id?: number
          inserted_at?: string
          market_value?: number | null
          matrix?: string
          patrimonial_value?: number | null
          property_id?: number
          sold?: boolean
          tipology?: string | null
          type?: Database["public"]["Enums"]["fraction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "fractions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      installment_payments: {
        Row: {
          amortization_movement_id: number | null
          contract_id: number
          extra_debt: number | null
          id: number
          inserted_at: string
          interest_movement_id: number
        }
        Insert: {
          amortization_movement_id?: number | null
          contract_id: number
          extra_debt?: number | null
          id?: number
          inserted_at?: string
          interest_movement_id: number
        }
        Update: {
          amortization_movement_id?: number | null
          contract_id?: number
          extra_debt?: number | null
          id?: number
          inserted_at?: string
          interest_movement_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "installment_payments_amortization_movement_id_fkey"
            columns: ["amortization_movement_id"]
            isOneToOne: false
            referencedRelation: "movements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts_debts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_payments_interest_movement_id_fkey"
            columns: ["interest_movement_id"]
            isOneToOne: false
            referencedRelation: "movements"
            referencedColumns: ["id"]
          },
        ]
      }
      installment_updates: {
        Row: {
          contract_id: number
          id: number
          inserted_at: string
          installment: number
          interest: number
          update_date: string
        }
        Insert: {
          contract_id: number
          id?: number
          inserted_at?: string
          installment: number
          interest: number
          update_date: string
        }
        Update: {
          contract_id?: number
          id?: number
          inserted_at?: string
          installment?: number
          interest?: number
          update_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "installment_updates_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_updates_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts_debts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_updates_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts_view"
            referencedColumns: ["id"]
          },
        ]
      }
      intervention_payments: {
        Row: {
          id: number
          inserted_at: string
          intervention_id: number
          movement_id: number
        }
        Insert: {
          id?: number
          inserted_at?: string
          intervention_id: number
          movement_id: number
        }
        Update: {
          id?: number
          inserted_at?: string
          intervention_id?: number
          movement_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "intervention_payments_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intervention_payments_movement_id_fkey"
            columns: ["movement_id"]
            isOneToOne: false
            referencedRelation: "movements"
            referencedColumns: ["id"]
          },
        ]
      }
      interventions: {
        Row: {
          description: string
          end_date: string | null
          fraction_id: number | null
          id: number
          inserted_at: string
          property_id: number
          start_date: string | null
          status: Database["public"]["Enums"]["intervention_status"]
          ticket_id: number | null
          type: Database["public"]["Enums"]["intervention_type"]
        }
        Insert: {
          description: string
          end_date?: string | null
          fraction_id?: number | null
          id?: number
          inserted_at?: string
          property_id: number
          start_date?: string | null
          status: Database["public"]["Enums"]["intervention_status"]
          ticket_id?: number | null
          type: Database["public"]["Enums"]["intervention_type"]
        }
        Update: {
          description?: string
          end_date?: string | null
          fraction_id?: number | null
          id?: number
          inserted_at?: string
          property_id?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["intervention_status"]
          ticket_id?: number | null
          type?: Database["public"]["Enums"]["intervention_type"]
        }
        Relationships: [
          {
            foreignKeyName: "interventions_fraction_id_fkey"
            columns: ["fraction_id"]
            isOneToOne: false
            referencedRelation: "fractions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_fraction_id_fkey"
            columns: ["fraction_id"]
            isOneToOne: false
            referencedRelation: "fractions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      lending_contracts: {
        Row: {
          contract_type: Database["public"]["Enums"]["contract_type"]
          down_payment: number
          id: number
          inserted_at: string
          sale_value: number
          yearly_raise: number
        }
        Insert: {
          contract_type?: Database["public"]["Enums"]["contract_type"]
          down_payment: number
          id?: number
          inserted_at?: string
          sale_value: number
          yearly_raise: number
        }
        Update: {
          contract_type?: Database["public"]["Enums"]["contract_type"]
          down_payment?: number
          id?: number
          inserted_at?: string
          sale_value?: number
          yearly_raise?: number
        }
        Relationships: [
          {
            foreignKeyName: "lending_contracts_id_contract_type_fkey"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id", "type"]
          },
          {
            foreignKeyName: "lending_contracts_id_contract_type_fkey"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts_view"
            referencedColumns: ["id", "type"]
          },
        ]
      }
      movements: {
        Row: {
          date: string
          description: string | null
          id: number
          inserted_at: string
          tax_id_number: string | null
          type: Database["public"]["Enums"]["movement_type"]
          value: number
        }
        Insert: {
          date: string
          description?: string | null
          id?: number
          inserted_at?: string
          tax_id_number?: string | null
          type: Database["public"]["Enums"]["movement_type"]
          value: number
        }
        Update: {
          date?: string
          description?: string | null
          id?: number
          inserted_at?: string
          tax_id_number?: string | null
          type?: Database["public"]["Enums"]["movement_type"]
          value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          display_name: string
          email: string
          id: string
          image: string | null
          inserted_at: string
        }
        Insert: {
          display_name: string
          email: string
          id: string
          image?: string | null
          inserted_at?: string
        }
        Update: {
          display_name?: string
          email?: string
          id?: string
          image?: string | null
          inserted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          area: number | null
          city: string
          class: Database["public"]["Enums"]["property_class"]
          conservatory: string
          country: string
          description: string | null
          id: number
          inserted_at: string
          is_multi_unit: boolean
          market_value: number | null
          matrix: string
          patrimonial_value: number | null
          postal_code: string
          region: string
          sold: boolean
          tipology: string | null
          type: Database["public"]["Enums"]["property_type"]
        }
        Insert: {
          address: string
          area?: number | null
          city: string
          class: Database["public"]["Enums"]["property_class"]
          conservatory: string
          country: string
          description?: string | null
          id?: number
          inserted_at?: string
          is_multi_unit: boolean
          market_value?: number | null
          matrix: string
          patrimonial_value?: number | null
          postal_code: string
          region: string
          sold?: boolean
          tipology?: string | null
          type: Database["public"]["Enums"]["property_type"]
        }
        Update: {
          address?: string
          area?: number | null
          city?: string
          class?: Database["public"]["Enums"]["property_class"]
          conservatory?: string
          country?: string
          description?: string | null
          id?: number
          inserted_at?: string
          is_multi_unit?: boolean
          market_value?: number | null
          matrix?: string
          patrimonial_value?: number | null
          postal_code?: string
          region?: string
          sold?: boolean
          tipology?: string | null
          type?: Database["public"]["Enums"]["property_type"]
        }
        Relationships: []
      }
      rent_payments: {
        Row: {
          contract_id: number
          id: number
          inserted_at: string
          movement_id: number
        }
        Insert: {
          contract_id: number
          id?: number
          inserted_at?: string
          movement_id: number
        }
        Update: {
          contract_id?: number
          id?: number
          inserted_at?: string
          movement_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "rent_payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "renting_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "renting_contracts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_payments_movement_id_fkey"
            columns: ["movement_id"]
            isOneToOne: false
            referencedRelation: "movements"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_updates: {
        Row: {
          contract_id: number
          id: number
          inserted_at: string
          rent: number
          update_date: string
        }
        Insert: {
          contract_id: number
          id?: number
          inserted_at?: string
          rent: number
          update_date: string
        }
        Update: {
          contract_id?: number
          id?: number
          inserted_at?: string
          rent?: number
          update_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_updates_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "renting_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_updates_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "renting_contracts_view"
            referencedColumns: ["id"]
          },
        ]
      }
      renting_contracts: {
        Row: {
          contract_type: Database["public"]["Enums"]["contract_type"]
          id: number
          inserted_at: string
        }
        Insert: {
          contract_type?: Database["public"]["Enums"]["contract_type"]
          id?: number
          inserted_at?: string
        }
        Update: {
          contract_type?: Database["public"]["Enums"]["contract_type"]
          id?: number
          inserted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "renting_contracts_id_contract_type_fkey"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id", "type"]
          },
          {
            foreignKeyName: "renting_contracts_id_contract_type_fkey"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts_view"
            referencedColumns: ["id", "type"]
          },
        ]
      }
      tenants: {
        Row: {
          address: string | null
          birth_date: string | null
          city: string | null
          country: string | null
          email: string | null
          gender: Database["public"]["Enums"]["gender"]
          id: number
          id_expiration_date: string | null
          id_number: string
          id_type: string
          inserted_at: string
          marital_status: Database["public"]["Enums"]["marital_status"]
          mobile: string | null
          name: string
          nationality: string
          phone: string | null
          postal_code: string | null
          region: string | null
          tax_id_number: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          email?: string | null
          gender: Database["public"]["Enums"]["gender"]
          id?: number
          id_expiration_date?: string | null
          id_number: string
          id_type: string
          inserted_at?: string
          marital_status: Database["public"]["Enums"]["marital_status"]
          mobile?: string | null
          name: string
          nationality: string
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          tax_id_number: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          email?: string | null
          gender?: Database["public"]["Enums"]["gender"]
          id?: number
          id_expiration_date?: string | null
          id_number?: string
          id_type?: string
          inserted_at?: string
          marital_status?: Database["public"]["Enums"]["marital_status"]
          mobile?: string | null
          name?: string
          nationality?: string
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          tax_id_number?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          date: string
          description: string
          fraction_id: number | null
          id: number
          inserted_at: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          property_id: number
          status: Database["public"]["Enums"]["ticket_status"]
          title: string
        }
        Insert: {
          date: string
          description: string
          fraction_id?: number | null
          id?: number
          inserted_at?: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          property_id: number
          status: Database["public"]["Enums"]["ticket_status"]
          title: string
        }
        Update: {
          date?: string
          description?: string
          fraction_id?: number | null
          id?: number
          inserted_at?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          property_id?: number
          status?: Database["public"]["Enums"]["ticket_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_fraction_id_fkey"
            columns: ["fraction_id"]
            isOneToOne: false
            referencedRelation: "fractions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_fraction_id_fkey"
            columns: ["fraction_id"]
            isOneToOne: false
            referencedRelation: "fractions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          description: string | null
          email: string | null
          id: number
          inserted_at: string
          mobile: string | null
          name: string
          phone: string | null
          postal_code: string | null
          region: string | null
          tags: string[]
          tax_id_number: string
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          description?: string | null
          email?: string | null
          id?: number
          inserted_at?: string
          mobile?: string | null
          name: string
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          tags?: string[]
          tax_id_number: string
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          description?: string | null
          email?: string | null
          id?: number
          inserted_at?: string
          mobile?: string | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          tags?: string[]
          tax_id_number?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      contracts_accounts_view: {
        Row: {
          contract_id: number | null
          date: string | null
          id: number | null
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
          data: Json | null
          end_date: string | null
          fraction_id: number | null
          id: number | null
          inserted_at: string | null
          is_active: boolean | null
          start_date: string | null
          type: Database["public"]["Enums"]["contract_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_fraction_id_fkey"
            columns: ["fraction_id"]
            isOneToOne: false
            referencedRelation: "fractions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_fraction_id_fkey"
            columns: ["fraction_id"]
            isOneToOne: false
            referencedRelation: "fractions_view"
            referencedColumns: ["id"]
          },
        ]
      }
      fractions_view: {
        Row: {
          address: string | null
          address_full: string | null
          area: number | null
          city: string | null
          country: string | null
          description: string | null
          id: number | null
          inserted_at: string | null
          market_value: number | null
          matrix: string | null
          patrimonial_value: number | null
          postal_code: string | null
          property_id: number | null
          region: string | null
          sold: boolean | null
          tipology: string | null
          type: Database["public"]["Enums"]["fraction_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "fractions_property_id_fkey"
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
          date: string | null
          description: string | null
          extra_debt: number | null
          id: number | null
          interest: number | null
        }
        Relationships: [
          {
            foreignKeyName: "installment_payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts_debts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "lending_contracts_view"
            referencedColumns: ["id"]
          },
        ]
      }
      intervention_payments_view: {
        Row: {
          date: string | null
          description: string | null
          id: number | null
          intervention_id: number | null
          value: number | null
        }
        Relationships: [
          {
            foreignKeyName: "intervention_payments_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
        ]
      }
      lending_contracts_debts_view: {
        Row: {
          debt: number | null
          extra_debt: number | null
          id: number | null
          last_payment_date: string | null
        }
        Relationships: []
      }
      lending_contracts_view: {
        Row: {
          contract_type: Database["public"]["Enums"]["contract_type"] | null
          debt: number | null
          down_payment: number | null
          extra_debt: number | null
          id: number | null
          inserted_at: string | null
          installment: number | null
          interest: number | null
          last_payment_date: string | null
          next_update: Json | null
          sale_value: number | null
          yearly_raise: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lending_contracts_id_contract_type_fkey"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id", "type"]
          },
          {
            foreignKeyName: "lending_contracts_id_contract_type_fkey"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts_view"
            referencedColumns: ["id", "type"]
          },
        ]
      }
      rent_payments_view: {
        Row: {
          contract_id: number | null
          date: string | null
          description: string | null
          id: number | null
          value: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rent_payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "renting_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_payments_contract_id_fkey"
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
          id: number | null
          inserted_at: string | null
          next_update: Json | null
          rent: number | null
        }
        Relationships: [
          {
            foreignKeyName: "renting_contracts_id_contract_type_fkey"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id", "type"]
          },
          {
            foreignKeyName: "renting_contracts_id_contract_type_fkey"
            columns: ["id", "contract_type"]
            isOneToOne: false
            referencedRelation: "contracts_view"
            referencedColumns: ["id", "type"]
          },
        ]
      }
    }
    Functions: {
      update_contract_tenants: {
        Args: {
          p_contract_id: number
          p_tenants: number[]
        }
        Returns: undefined
      }
    }
    Enums: {
      contract_type: "renting" | "lending"
      fraction_type: "apartment" | "store" | "garage" | "house" | "terrain"
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
      property_type: "building" | "terrain" | "house" | "garages"
      salary_type: "hourly" | "monthly"
      ticket_priority: "low" | "medium" | "high"
      ticket_status: "open" | "in_progress" | "resolved" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

