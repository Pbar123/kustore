export interface Product {
  id: string;
  name: string;
  real_price: number;
  fake_original_price: number;
  image_url: string;
  images?: string[];
  image_alt_texts?: string[];
  category: string;
  subcategory?: string;
  color?: string;
  brand?: string;
  description: string;
  sizes: string[];
  in_stock: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
  measurements?: Record<string, Record<string, string>>;
  stock_quantity?: Record<string, number>;
  features?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  size: string;
  quantity: number;
  real_price: number;
  total: number;
}

export interface Order {
  id: string;
  user_id: number;
  items: OrderItem[];
  total_amount: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  delivery_method: 'boxberry' | 'russian_post' | 'cdek';
  payment_method: 'bank_transfer';
  status: 'new' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PromoCode {
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
}

export interface User {
  name: string;
  email: string;
}