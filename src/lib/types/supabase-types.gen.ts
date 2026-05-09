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
          address: string | null
          city: string | null
          country: string | null
          id: number
          inserted_at: string
          postal_code: string | null
          region: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          id?: number
          inserted_at?: string
          postal_code?: string | null
          region?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          id?: number
          inserted_at?: string
          postal_code?: string | null
          region?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          end_date: string | null
          id: number
          inserted_at: string
          is_active: boolean
          property_id: number
          start_date: string
          type: Database["public"]["Enums"]["contract_type"]
          updated_at: string
        }
        Insert: {
          end_date?: string | null
          id?: number
          inserted_at?: string
          is_active?: boolean
          property_id: number
          start_date: string
          type: Database["public"]["Enums"]["contract_type"]
          updated_at?: string
        }
        Update: {
          end_date?: string | null
          id?: number
          inserted_at?: string
          is_active?: boolean
          property_id?: number
          start_date?: string
          type?: Database["public"]["Enums"]["contract_type"]
          updated_at?: string
        }
        Relationships: [
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
          address_id: number | null
          birth_date: string | null
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
          salary: number
          salary_type: Database["public"]["Enums"]["salary_type"]
          ss_number: string
          tax_id_number: string
        }
        Insert: {
          address_id?: number | null
          birth_date?: string | null
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
          salary: number
          salary_type: Database["public"]["Enums"]["salary_type"]
          ss_number: string
          tax_id_number: string
        }
        Update: {
          address_id?: number | null
          birth_date?: string | null
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
          salary?: number
          salary_type?: Database["public"]["Enums"]["salary_type"]
          ss_number?: string
          tax_id_number?: string
        }
        Relationships: [
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
            foreignKeyName: "fk_intervention_payments_intervention_id"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_intervention_payments_movement_id"
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
        Relationships: []
      }
      properties: {
        Row: {
          address_id: number
          area: number | null
          class: Database["public"]["Enums"]["property_class"]
          conservatory: string
          description: string | null
          fraction: string | null
          id: number
          inserted_at: string
          market_value: number | null
          matrix: string
          parent_id: number | null
          patrimonial_value: number | null
          sold: boolean
          tipology: string | null
          type: Database["public"]["Enums"]["property_type"]
        }
        Insert: {
          address_id: number
          area?: number | null
          class: Database["public"]["Enums"]["property_class"]
          conservatory: string
          description?: string | null
          fraction?: string | null
          id?: number
          inserted_at?: string
          market_value?: number | null
          matrix: string
          parent_id?: number | null
          patrimonial_value?: number | null
          sold?: boolean
          tipology?: string | null
          type: Database["public"]["Enums"]["property_type"]
        }
        Update: {
          address_id?: number
          area?: number | null
          class?: Database["public"]["Enums"]["property_class"]
          conservatory?: string
          description?: string | null
          fraction?: string | null
          id?: number
          inserted_at?: string
          market_value?: number | null
          matrix?: string
          parent_id?: number | null
          patrimonial_value?: number | null
          sold?: boolean
          tipology?: string | null
          type?: Database["public"]["Enums"]["property_type"]
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
        ]
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
        ]
      }
      tenants: {
        Row: {
          address_id: number | null
          birth_date: string | null
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
          tax_id_number: string
        }
        Insert: {
          address_id?: number | null
          birth_date?: string | null
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
          tax_id_number: string
        }
        Update: {
          address_id?: number | null
          birth_date?: string | null
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
          tax_id_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tenants_address_id"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          date: string
          description: string
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
          id?: number
          inserted_at?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          property_id?: number
          status?: Database["public"]["Enums"]["ticket_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tickets_property_id"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address_id: number | null
          description: string | null
          email: string | null
          id: number
          inserted_at: string
          mobile: string | null
          name: string
          phone: string | null
          tags: string[]
          tax_id_number: string
          website: string | null
        }
        Insert: {
          address_id?: number | null
          description?: string | null
          email?: string | null
          id?: number
          inserted_at?: string
          mobile?: string | null
          name: string
          phone?: string | null
          tags?: string[]
          tax_id_number: string
          website?: string | null
        }
        Update: {
          address_id?: number | null
          description?: string | null
          email?: string | null
          id?: number
          inserted_at?: string
          mobile?: string | null
          name?: string
          phone?: string | null
          tags?: string[]
          tax_id_number?: string
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
        ]
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
          id: number | null
          inserted_at: string | null
          is_active: boolean | null
          property_id: number | null
          start_date: string | null
          type: Database["public"]["Enums"]["contract_type"] | null
          updated_at: string | null
        }
        Relationships: [
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
          date: string | null
          description: string | null
          extra_debt: number | null
          id: number | null
          interest: number | null
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
            foreignKeyName: "fk_intervention_payments_intervention_id"
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
          id: number | null
          inserted_at: string | null
          next_update: Json | null
          rent: number | null
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
        ]
      }
    }
    Functions: {
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

