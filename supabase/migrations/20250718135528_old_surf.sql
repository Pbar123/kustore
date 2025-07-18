/*
  # Fix products table structure

  1. Remove non-existent columns that cause errors
  2. Ensure all required columns exist with correct types
  3. Update any missing columns

  This migration fixes the 'is_on_sale' column error and other schema issues.
*/

-- Remove the is_on_sale column if it exists (it shouldn't based on our schema)
ALTER TABLE products DROP COLUMN IF EXISTS is_on_sale;

-- Ensure all required columns exist with correct names and types
DO $$
BEGIN
  -- Check and add missing columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'real_price'
  ) THEN
    ALTER TABLE products ADD COLUMN real_price numeric(10,2) NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'fake_original_price'
  ) THEN
    ALTER TABLE products ADD COLUMN fake_original_price numeric(10,2) NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE products ADD COLUMN stock_quantity jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'measurements'
  ) THEN
    ALTER TABLE products ADD COLUMN measurements jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'features'
  ) THEN
    ALTER TABLE products ADD COLUMN features text[] DEFAULT '{}'::text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'images'
  ) THEN
    ALTER TABLE products ADD COLUMN images text[] DEFAULT '{}'::text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'image_alt_texts'
  ) THEN
    ALTER TABLE products ADD COLUMN image_alt_texts text[] DEFAULT '{}'::text[];
  END IF;
END $$;