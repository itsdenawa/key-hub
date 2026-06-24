export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string;
          country: string;
          created_at: string;
          full_name: string;
          id: string;
          is_default: boolean;
          label: string;
          line1: string;
          line2: string | null;
          postal_code: string;
          region: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          city: string;
          country?: string;
          created_at?: string;
          full_name: string;
          id?: string;
          is_default?: boolean;
          label?: string;
          line1: string;
          line2?: string | null;
          postal_code: string;
          region?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          image_path: string | null;
          is_active: boolean;
          name: string;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string;
          id?: string;
          image_path?: string | null;
          is_active?: boolean;
          name: string;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      entitlements: {
        Row: {
          active: boolean;
          granted_at: string;
          id: string;
          order_item_id: string;
          product_id: string;
          revoked_at: string | null;
          user_id: string;
        };
        Insert: {
          active?: boolean;
          granted_at?: string;
          id?: string;
          order_item_id: string;
          product_id: string;
          revoked_at?: string | null;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["entitlements"]["Insert"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          created_at: string;
          id: string;
          order_id: string;
          product_id: string;
          product_title: string;
          quantity: number;
          total_amount_cents: number;
          unit_amount_cents: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          order_id: string;
          product_id: string;
          product_title: string;
          quantity?: number;
          unit_amount_cents: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          created_at: string;
          currency: string;
          customer_email: string | null;
          id: string;
          status: Database["public"]["Enums"]["order_status"];
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          total_cents: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          currency?: string;
          customer_email?: string | null;
          id?: string;
          status?: Database["public"]["Enums"]["order_status"];
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          total_cents?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
      product_assets: {
        Row: {
          created_at: string;
          filename: string;
          id: string;
          is_active: boolean;
          product_id: string;
          size_mb: number;
          storage_path: string;
          updated_at: string;
          version: string;
        };
        Insert: {
          created_at?: string;
          filename: string;
          id?: string;
          is_active?: boolean;
          product_id: string;
          size_mb?: number;
          storage_path: string;
          updated_at?: string;
          version?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["product_assets"]["Insert"]
        >;
        Relationships: [];
      };
      product_images: {
        Row: {
          alt: string;
          created_at: string;
          id: string;
          product_id: string;
          sort_order: number;
          storage_path: string;
        };
        Insert: {
          alt?: string;
          created_at?: string;
          id?: string;
          product_id: string;
          sort_order?: number;
          storage_path: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["product_images"]["Insert"]
        >;
        Relationships: [];
      };
      products: {
        Row: {
          category_id: string | null;
          created_at: string;
          currency: string;
          delivery: string;
          description: string;
          file_types: string[];
          id: string;
          license: string;
          long_description: string;
          price_cents: number;
          rating: number;
          slug: string;
          status: Database["public"]["Enums"]["product_status"];
          stripe_price_id: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string;
          currency?: string;
          delivery?: string;
          description?: string;
          file_types?: string[];
          id?: string;
          license?: string;
          long_description?: string;
          price_cents: number;
          rating?: number;
          slug: string;
          status?: Database["public"]["Enums"]["product_status"];
          stripe_price_id?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["profile_role"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["profile_role"];
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      wishlist_items: {
        Row: {
          created_at: string;
          product_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          product_id: string;
          user_id: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["wishlist_items"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_user_is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      user_has_active_entitlement: {
        Args: {
          product: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      order_status: "pending" | "paid" | "fulfilled" | "canceled" | "refunded";
      product_status: "draft" | "active" | "archived";
      profile_role: "customer" | "admin";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Inserts<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type Updates<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
