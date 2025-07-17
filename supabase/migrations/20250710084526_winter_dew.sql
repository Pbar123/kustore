/*
  # Add measurements to products table

  1. Changes
    - Add `measurements` column to store size measurements as JSONB
    - The measurements will be stored as an object where keys are sizes and values are measurement objects
    
  2. Structure
    - measurements: { "S": { "Грудь": "92-96 см", "Талия": "72-76 см", ... }, "M": { ... } }
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'measurements'
  ) THEN
    ALTER TABLE products ADD COLUMN measurements JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;