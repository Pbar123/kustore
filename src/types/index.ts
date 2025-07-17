export interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
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
  is_on_sale: boolean;
  created_at: string;
  updated_at: string;
  measurements?: Record<string, Record<string, string>>;
  stock_quantity?: Record<string, number>;
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
  price: number;
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

export interface User {
  name: string;
  email: string;
}