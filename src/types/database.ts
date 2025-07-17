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
    };
  };
}