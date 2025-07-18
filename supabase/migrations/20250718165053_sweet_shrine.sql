/*
  # Fix orders RLS policy for checkout

  1. Security Changes
    - Update RLS policy to allow order creation for both authenticated and anonymous users
    - Fix user_id handling for test users
    - Ensure orders can be created from web app

  2. Changes
    - Modified INSERT policy to handle both authenticated users and anonymous orders
    - Updated policy logic to work with test user IDs
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for all users" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can manage all orders" ON orders;

-- Create new policies that work with our authentication system
CREATE POLICY "Allow order creation for all users"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own orders or anonymous orders"
  ON orders
  FOR SELECT
  TO public
  USING (
    user_id IS NULL OR 
    user_id = (
      SELECT users.id
      FROM users
      WHERE users.telegram_id = 
        CASE
          WHEN (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) IS NOT NULL) 
          THEN (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text))::bigint
          ELSE 999999999::bigint  -- Default test user ID
        END
    )
  );

CREATE POLICY "Authenticated users can manage all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);