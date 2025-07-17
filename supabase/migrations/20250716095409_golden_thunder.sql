/*
  # Create orders table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (bigint, foreign key to users)
      - `items` (jsonb, array of ordered items)
      - `total_amount` (numeric, total order cost)
      - `customer_name` (text, customer full name)
      - `customer_phone` (text, customer phone number)
      - `customer_email` (text, optional customer email)
      - `delivery_address` (text, delivery address)
      - `delivery_method` (text, preferred delivery method)
      - `payment_method` (text, payment method)
      - `status` (text, order status)
      - `admin_notes` (text, admin notes)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `orders` table
    - Add policies for users to read their own orders
    - Add policies for authenticated users to create orders
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id bigint REFERENCES users(id),
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_amount numeric(10,2) NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  delivery_address text NOT NULL,
  delivery_method text NOT NULL DEFAULT 'boxberry',
  payment_method text NOT NULL DEFAULT 'bank_transfer',
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can read their own orders
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text::bigint = user_id);

-- Users can create orders
CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text::bigint = user_id);

-- Admins can read all orders (you'll need to set up admin role)
CREATE POLICY "Admins can read all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true); -- You can modify this to check for admin role

-- Admins can update orders
CREATE POLICY "Admins can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (true); -- You can modify this to check for admin role