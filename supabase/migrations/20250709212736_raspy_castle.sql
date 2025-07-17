/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, product name)
      - `price` (decimal, product price)
      - `sale_price` (decimal, optional sale price)
      - `image_url` (text, product image URL)
      - `category` (text, product category)
      - `description` (text, product description)
      - `sizes` (text array, available sizes)
      - `in_stock` (boolean, availability status)
      - `is_new` (boolean, new product flag)
      - `is_on_sale` (boolean, sale product flag)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access to products
    - Add policy for authenticated users to manage products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10,2) NOT NULL,
  sale_price decimal(10,2),
  image_url text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  sizes text[] NOT NULL DEFAULT '{}',
  in_stock boolean DEFAULT true,
  is_new boolean DEFAULT false,
  is_on_sale boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert products
CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update products
CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete products
CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert test data
INSERT INTO products (name, price, sale_price, image_url, category, description, sizes, in_stock, is_new, is_on_sale) VALUES
('Essential White Tee', 29.99, NULL, 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800', 'shirts', 'Premium cotton basic tee with perfect fit and comfort.', ARRAY['S', 'M', 'L', 'XL'], true, true, false),
('Classic Black Jeans', 89.99, 69.99, 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800', 'pants', 'Timeless black denim with modern slim fit.', ARRAY['28', '30', '32', '34', '36'], true, false, true),
('Minimal Hoodie', 69.99, NULL, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', 'hoodies', 'Comfortable gray hoodie with clean design.', ARRAY['S', 'M', 'L', 'XL'], true, true, false),
('Structured Blazer', 149.99, 119.99, 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800', 'jackets', 'Professional black blazer for any occasion.', ARRAY['S', 'M', 'L', 'XL'], true, false, true),
('Ribbed Knit Sweater', 59.99, NULL, 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', 'sweaters', 'Soft ribbed knit in neutral gray tone.', ARRAY['S', 'M', 'L', 'XL'], true, true, false),
('Tailored Trousers', 79.99, 59.99, 'https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg?auto=compress&cs=tinysrgb&w=800', 'pants', 'Elegant tailored trousers in charcoal gray.', ARRAY['28', '30', '32', '34', '36'], true, false, true),
('Oversized Turtleneck', 49.99, NULL, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800', 'shirts', 'Comfortable oversized turtleneck in cream white.', ARRAY['S', 'M', 'L', 'XL'], true, true, false),
('Wool Coat', 199.99, 159.99, 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800', 'jackets', 'Premium wool coat in classic black.', ARRAY['S', 'M', 'L', 'XL'], true, false, true),
('Casual Denim Jacket', 89.99, NULL, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800', 'jackets', 'Classic denim jacket for everyday wear.', ARRAY['S', 'M', 'L', 'XL'], true, true, false),
('Striped Long Sleeve', 39.99, 29.99, 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800', 'shirts', 'Comfortable striped long sleeve shirt.', ARRAY['S', 'M', 'L', 'XL'], true, false, true),
('Slim Fit Chinos', 69.99, NULL, 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800', 'pants', 'Modern slim fit chinos in beige.', ARRAY['28', '30', '32', '34', '36'], true, true, false),
('Knitted Cardigan', 79.99, 59.99, 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', 'sweaters', 'Cozy knitted cardigan for layering.', ARRAY['S', 'M', 'L', 'XL'], true, false, true);