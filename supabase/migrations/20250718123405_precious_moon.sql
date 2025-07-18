/*
  # Create measurements table

  1. New Tables
    - `measurements`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key to products)
      - `size` (text, размер товара)
      - `measurement_a` (numeric, замер A в см)
      - `measurement_b` (numeric, замер B в см)
      - `measurement_c` (numeric, замер C в см)
      - `measurement_d` (numeric, замер D в см, опционально)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `measurements` table
    - Add policy for public read access
    - Add policy for authenticated users to manage measurements

  3. Changes
    - Create unique constraint on product_id + size combination
    - Add foreign key constraint to products table
*/

CREATE TABLE IF NOT EXISTS measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size text NOT NULL,
  measurement_a numeric(5,1),
  measurement_b numeric(5,1),
  measurement_c numeric(5,1),
  measurement_d numeric(5,1),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, size)
);

ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;

-- Public can read measurements
CREATE POLICY "Measurements are viewable by everyone"
  ON measurements
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can manage measurements
CREATE POLICY "Authenticated users can manage measurements"
  ON measurements
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_measurements_product_id ON measurements(product_id);
CREATE INDEX IF NOT EXISTS idx_measurements_size ON measurements(size);