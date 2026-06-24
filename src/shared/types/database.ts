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
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "entitlements_order_item_id_fkey";
            columns: ["order_item_id"];
            isOneToOne: false;
            referencedRelation: "order_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "entitlements_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "entitlements_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "product_assets_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wishlist_items_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
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
