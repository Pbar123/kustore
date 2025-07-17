/*
  # Add features column to products table

  1. Changes
    - Add `features` column to `products` table as text array
    - Set default value to empty array
    - Allow null values for backward compatibility

  2. Security
    - No changes to RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'features'
  ) THEN
    ALTER TABLE products ADD COLUMN features text[] DEFAULT '{}';
  END IF;
END $$;