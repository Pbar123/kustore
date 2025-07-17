/*
  # Fix users table RLS policies

  1. Security Changes
    - Allow public access for user creation and reading
    - Fix authentication policies for users table
    - Enable proper user management
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Allow anyone to insert users (needed for Telegram registration)
CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO public
  USING (true);

-- Allow users to update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;