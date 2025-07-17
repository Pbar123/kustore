/*
  # Add stock quantity control

  1. New Column
    - `stock_quantity` (integer) - количество товара на складе для каждого размера

  2. Updates
    - Добавляем поле stock_quantity как JSONB для хранения количества по размерам
    - Обновляем существующие товары с тестовыми данными
*/

-- Add stock_quantity column to track inventory per size
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE products ADD COLUMN stock_quantity JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Update existing products with sample stock quantities
UPDATE products 
SET stock_quantity = CASE 
  WHEN array_length(sizes, 1) IS NOT NULL THEN
    (
      SELECT jsonb_object_agg(size_name, (RANDOM() * 5 + 1)::integer)
      FROM unnest(sizes) AS size_name
    )
  ELSE '{}'::jsonb
END
WHERE stock_quantity IS NULL OR stock_quantity = '{}'::jsonb;

-- Add some specific stock quantities for our sample products
UPDATE products 
SET stock_quantity = '{
  "XS": 2,
  "S": 3,
  "M": 5,
  "L": 4,
  "XL": 1
}'::jsonb
WHERE name = 'Классическая белая рубашка';

UPDATE products 
SET stock_quantity = '{
  "XS": 1,
  "S": 2,
  "M": 3,
  "L": 2,
  "XL": 1
}'::jsonb
WHERE name = 'Элегантное черное платье';

UPDATE products 
SET stock_quantity = '{
  "XS": 3,
  "S": 4,
  "M": 6,
  "L": 3,
  "XL": 2
}'::jsonb
WHERE name = 'Классические джинсы';

UPDATE products 
SET stock_quantity = '{
  "S": 2,
  "M": 4,
  "L": 3,
  "XL": 1
}'::jsonb
WHERE name = 'Уютный вязаный свитер';

UPDATE products 
SET stock_quantity = '{
  "XS": 1,
  "S": 2,
  "M": 3,
  "L": 1
}'::jsonb
WHERE name = 'Мини-юбка из твида';

UPDATE products 
SET stock_quantity = '{
  "ONE SIZE": 3
}'::jsonb
WHERE name = 'Кожаная сумка-тоут';