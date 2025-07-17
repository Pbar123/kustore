/*
  # Create promo codes system

  1. New Tables
    - `promo_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique) - промокод
      - `name` (text) - название промокода
      - `description` (text) - описание
      - `discount_type` (text) - тип скидки: 'percentage', 'fixed_amount'
      - `discount_value` (numeric) - размер скидки
      - `min_order_amount` (numeric) - минимальная сумма заказа
      - `min_items_count` (integer) - минимальное количество товаров
      - `categories` (text[]) - категории товаров (пустой массив = все категории)
      - `max_uses` (integer) - максимальное количество использований
      - `current_uses` (integer) - текущее количество использований
      - `valid_from` (timestamptz) - действует с
      - `valid_until` (timestamptz) - действует до
      - `is_active` (boolean) - активен ли промокод
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `promo_codes` table
    - Add policies for public read access and authenticated admin management
*/

CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value numeric(10,2) NOT NULL CHECK (discount_value > 0),
  min_order_amount numeric(10,2) DEFAULT 0,
  min_items_count integer DEFAULT 1,
  categories text[] DEFAULT '{}',
  max_uses integer DEFAULT NULL, -- NULL = unlimited
  current_uses integer DEFAULT 0,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Public can read active promo codes
CREATE POLICY "Active promo codes are viewable by everyone"
  ON promo_codes
  FOR SELECT
  TO public
  USING (is_active = true AND valid_from <= now() AND valid_until >= now());

-- Authenticated users can manage promo codes (for admin)
CREATE POLICY "Authenticated users can manage promo codes"
  ON promo_codes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert some example promo codes
INSERT INTO promo_codes (code, name, description, discount_type, discount_value, min_order_amount, min_items_count, categories, max_uses, valid_until) VALUES
('SHIRTS10', 'Скидка на рубашки', 'Скидка 10% на все рубашки при покупке от 2 штук', 'percentage', 10, 0, 2, '{"shirts"}', 100, now() + interval '30 days'),
('WELCOME15', 'Приветственная скидка', 'Скидка 15% на первый заказ от 1500 рублей', 'percentage', 15, 1500, 1, '{}', 500, now() + interval '60 days'),
('JEANS500', 'Скидка на джинсы', 'Скидка 500 рублей на джинсы при заказе от 3000 рублей', 'fixed_amount', 500, 3000, 1, '{"jeans"}', 50, now() + interval '14 days');