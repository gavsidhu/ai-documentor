export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: {
          api_key: Json
          user_id: string
        }
        Insert: {
          api_key: Json
          user_id: string
        }
        Update: {
          api_key?: Json
          user_id?: string
        }
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
      }
      payments: {
        Row: {
          checkout_session_id: string | null
          checkout_status: Database["public"]["Enums"]["checkout_status"] | null
          created: string
          id: string
          metadata: Json | null
          payment_intent_status:
            | Database["public"]["Enums"]["payment_intent_status"]
            | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          price_id: string | null
          quantity: number | null
          user_id: string
        }
        Insert: {
          checkout_session_id?: string | null
          checkout_status?:
            | Database["public"]["Enums"]["checkout_status"]
            | null
          created?: string
          id: string
          metadata?: Json | null
          payment_intent_status?:
            | Database["public"]["Enums"]["payment_intent_status"]
            | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          price_id?: string | null
          quantity?: number | null
          user_id: string
        }
        Update: {
          checkout_session_id?: string | null
          checkout_status?:
            | Database["public"]["Enums"]["checkout_status"]
            | null
          created?: string
          id?: string
          metadata?: Json | null
          payment_intent_status?:
            | Database["public"]["Enums"]["payment_intent_status"]
            | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          price_id?: string | null
          quantity?: number | null
          user_id?: string
        }
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
      }
      queue: {
        Row: {
          created_at: string | null
          id: number
          payload: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          payload?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          payload?: string | null
          status?: string | null
          updated_at?: string | null
        }
      }
      security_keys: {
        Row: {
          security_key: string
          user_email: string
        }
        Insert: {
          security_key: string
          user_email: string
        }
        Update: {
          security_key?: string
          user_email?: string
        }
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          email: string
          full_name: string | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          email: string
          full_name?: string | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          email?: string
          full_name?: string | null
          id?: string
          payment_method?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      checkout_status: "open" | "complete" | "expired"
      payment_intent_status:
        | "requires_payment_method"
        | "requires_confirmation"
        | "requires_action"
        | "processing"
        | "requires_capture"
        | "canceled"
        | "succeeded"
      payment_status: "paid" | "unpaid" | "no_payment_required"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
