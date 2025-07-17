/*
  # Add favorites functionality and enhance user order tracking

  1. New Tables
    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (bigint, foreign key to users)
      - `product_id` (uuid, foreign key to products)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_favorites` table
    - Add policies for users to manage their own favorites
    - Update orders policies for better user access

  3. Changes
    - Users can add/remove products from favorites
    - Users can view their order history
    - Enhanced order tracking capabilities
*/

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on user_favorites
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for user_favorites
CREATE POLICY "Users can view own favorites"
  ON user_favorites
  FOR SELECT
  TO public
  USING (user_id = (SELECT id FROM users WHERE telegram_id = (
    CASE 
      WHEN current_setting('request.jwt.claims', true)::json->>'sub' IS NOT NULL 
      THEN (current_setting('request.jwt.claims', true)::json->>'sub')::bigint
      ELSE 0
    END
  )));

CREATE POLICY "Users can add to favorites"
  ON user_favorites
  FOR INSERT
  TO public
  WITH CHECK (user_id = (SELECT id FROM users WHERE telegram_id = (
    CASE 
      WHEN current_setting('request.jwt.claims', true)::json->>'sub' IS NOT NULL 
      THEN (current_setting('request.jwt.claims', true)::json->>'sub')::bigint
      ELSE 0
    END
  )));

CREATE POLICY "Users can remove from favorites"
  ON user_favorites
  FOR DELETE
  TO public
  USING (user_id = (SELECT id FROM users WHERE telegram_id = (
    CASE 
      WHEN current_setting('request.jwt.claims', true)::json->>'sub' IS NOT NULL 
      THEN (current_setting('request.jwt.claims', true)::json->>'sub')::bigint
      ELSE 0
    END
  )));

-- Update orders policies for better user access
DROP POLICY IF EXISTS "Enable select for all users" ON orders;
DROP POLICY IF EXISTS "Enable update for all users" ON orders;

CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO public
  USING (
    user_id = (SELECT id FROM users WHERE telegram_id = (
      CASE 
        WHEN current_setting('request.jwt.claims', true)::json->>'sub' IS NOT NULL 
        THEN (current_setting('request.jwt.claims', true)::json->>'sub')::bigint
        ELSE 0
      END
    ))
    OR 
    user_id IS NULL -- Allow viewing orders without user_id (guest orders)
  );

CREATE POLICY "Authenticated users can manage all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_product_id ON user_favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);