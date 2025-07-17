/*
  # Add color and brand fields to products table

  1. Schema Changes
    - Add `color` column to store product color
    - Add `brand` column to store product brand
    - Add `subcategory` column for more specific categorization

  2. Data Updates
    - Update existing products with color and brand information
    - Add subcategory data for better filtering
*/

-- Add new columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'color'
  ) THEN
    ALTER TABLE products ADD COLUMN color text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'brand'
  ) THEN
    ALTER TABLE products ADD COLUMN brand text DEFAULT 'KUSTORE';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'subcategory'
  ) THEN
    ALTER TABLE products ADD COLUMN subcategory text;
  END IF;
END $$;

-- Update existing products with color information
UPDATE products SET 
  color = CASE 
    WHEN name ILIKE '%белый%' OR name ILIKE '%white%' OR description ILIKE '%белый%' THEN 'Белый'
    WHEN name ILIKE '%черный%' OR name ILIKE '%black%' OR description ILIKE '%черный%' THEN 'Черный'
    WHEN name ILIKE '%серый%' OR name ILIKE '%gray%' OR name ILIKE '%grey%' OR description ILIKE '%серый%' THEN 'Серый'
    WHEN name ILIKE '%синий%' OR name ILIKE '%blue%' OR description ILIKE '%синий%' THEN 'Синий'
    WHEN name ILIKE '%красный%' OR name ILIKE '%red%' OR description ILIKE '%красный%' THEN 'Красный'
    WHEN name ILIKE '%зеленый%' OR name ILIKE '%green%' OR description ILIKE '%зеленый%' THEN 'Зеленый'
    WHEN name ILIKE '%коричневый%' OR name ILIKE '%brown%' OR description ILIKE '%коричневый%' THEN 'Коричневый'
    WHEN name ILIKE '%бежевый%' OR name ILIKE '%beige%' OR description ILIKE '%бежевый%' THEN 'Бежевый'
    ELSE 'Черный' -- Default color
  END
WHERE color IS NULL;

-- Update existing products with brand information based on price
UPDATE products SET 
  brand = CASE 
    WHEN price > 150 THEN 'Premium'
    WHEN price > 100 THEN 'Elegant'
    WHEN price > 50 THEN 'Modern'
    ELSE 'Classic'
  END
WHERE brand = 'KUSTORE' OR brand IS NULL;

-- Update subcategory based on category
UPDATE products SET 
  subcategory = CASE 
    WHEN category = 'T-Shirts' THEN 'Футболки'
    WHEN category = 'Jeans' THEN 'Джинсы'
    WHEN category = 'Jackets' THEN 'Куртки'
    WHEN category = 'Sweaters' THEN 'Свитеры'
    WHEN category = 'Dresses' THEN 'Платья'
    WHEN category = 'Shirts' THEN 'Рубашки'
    WHEN category = 'Accessories' THEN 'Аксессуары'
    WHEN category = 'Shoes' THEN 'Обувь'
    WHEN category = 'Skirts' THEN 'Юбки'
    WHEN category = 'shirts' THEN 'Рубашки'
    WHEN category = 'jeans' THEN 'Джинсы'
    WHEN category = 'sweaters' THEN 'Свитеры'
    WHEN category = 'dresses' THEN 'Платья'
    WHEN category = 'skirts' THEN 'Юбки'
    WHEN category = 'bags' THEN 'Сумки'
    ELSE category
  END
WHERE subcategory IS NULL;