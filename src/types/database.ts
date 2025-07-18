export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          real_price: number;
          fake_original_price: number;
          image_url: string;
          images: string[];
          image_alt_texts: string[];
          category: string;
          subcategory: string | null;
          color: string | null;
          brand: string | null;
          description: string;
          sizes: string[];
          in_stock: boolean;
          is_new: boolean;
          created_at: string;
          updated_at: string;
          measurements: Record<string, Record<string, string>>;
          stock_quantity: Record<string, number>;
          features: string[];
        };
        Insert: {
          id?: string;
          name: string;
          real_price: number;
          fake_original_price: number;
          image_url: string;
          images?: string[];
          image_alt_texts?: string[];
          category: string;
          subcategory?: string | null;
          color?: string | null;
          brand?: string | null;
          description: string;
          sizes: string[];
          in_stock?: boolean;
          is_new?: boolean;
          created_at?: string;
          updated_at?: string;
          measurements?: Record<string, Record<string, string>>;
          stock_quantity?: Record<string, number>;
          features?: string[];
        };
        Update: {
          id?: string;
          name?: string;
          real_price?: number;
          fake_original_price?: number;
          image_url?: string;
          images?: string[];
          image_alt_texts?: string[];
          category?: string;
          subcategory?: string | null;
          color?: string | null;
          brand?: string | null;
          description?: string;
          sizes?: string[];
          in_stock?: boolean;
          is_new?: boolean;
          created_at?: string;
          updated_at?: string;
          measurements?: Record<string, Record<string, string>>;
          stock_quantity?: Record<string, number>;
          features?: string[];
        };
      };
      promo_codes: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string;
          discount_type: 'percentage' | 'fixed_amount';
          discount_value: number;
          min_order_amount: number;
          min_items_count: number;
          categories: string[];
          max_uses: number | null;
          current_uses: number;
          valid_from: string;
          valid_until: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description: string;
          discount_type: 'percentage' | 'fixed_amount';
          discount_value: number;
          min_order_amount?: number;
          min_items_count?: number;
          categories?: string[];
          max_uses?: number | null;
          current_uses?: number;
          valid_from?: string;
          valid_until: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string;
          discount_type?: 'percentage' | 'fixed_amount';
          discount_value?: number;
          min_order_amount?: number;
          min_items_count?: number;
          categories?: string[];
          max_uses?: number | null;
          current_uses?: number;
          valid_from?: string;
          valid_until?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: number;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: number;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: number;
          product_id?: string;
          created_at?: string;
        };
      };
    };
  };
}