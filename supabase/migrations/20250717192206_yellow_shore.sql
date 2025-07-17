/*
  # Update pricing system for fake discounts

  1. Schema Changes
    - Rename `price` to `real_price` (actual selling price)
    - Rename `sale_price` to `fake_original_price` (crossed out price)
    - Remove `is_on_sale` column (no longer needed)
    - Update all existing products to have fake original prices

  2. Data Migration
    - Set fake_original_price to be 20-50% higher than current price
    - Remove sale-related columns and constraints

  3. Security
    - Update RLS policies if needed
*/

-- Add new columns
ALTER TABLE products ADD COLUMN real_price numeric(10,2);
ALTER TABLE products ADD COLUMN fake_original_price numeric(10,2);

-- Migrate existing data
UPDATE products SET 
  real_price = CASE 
    WHEN sale_price IS NOT NULL THEN sale_price 
    ELSE price 
  END,
  fake_original_price = CASE 
    WHEN sale_price IS NOT NULL THEN price
    ELSE price * 1.3  -- 30% higher fake original price
  END;

-- Make new columns NOT NULL
ALTER TABLE products ALTER COLUMN real_price SET NOT NULL;
ALTER TABLE products ALTER COLUMN fake_original_price SET NOT NULL;

-- Drop old columns
ALTER TABLE products DROP COLUMN price;
ALTER TABLE products DROP COLUMN sale_price;
ALTER TABLE products DROP COLUMN is_on_sale;

-- Update any indexes or constraints if needed
-- (No specific indexes to update in this case)