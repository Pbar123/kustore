/*
  # Add test measurements data

  1. Updates
    - Add realistic measurements for different clothing categories
    - Include measurements for all common sizes (XS, S, M, L, XL, XXL)
    - Different measurement types for different clothing categories

  2. Data Structure
    - Each size has specific measurements in centimeters
    - Measurements include: chest/bust, waist, hips, length, sleeve (where applicable)
    - Realistic sizing progression between sizes
*/

-- Update products with test measurements data
UPDATE products 
SET measurements = '{
  "XS": {
    "Грудь": "80-84 см",
    "Талия": "60-64 см", 
    "Бедра": "86-90 см",
    "Длина": "65 см",
    "Рукав": "58 см"
  },
  "S": {
    "Грудь": "84-88 см",
    "Талия": "64-68 см",
    "Бедра": "90-94 см", 
    "Длина": "67 см",
    "Рукав": "60 см"
  },
  "M": {
    "Грудь": "88-92 см",
    "Талия": "68-72 см",
    "Бедра": "94-98 см",
    "Длина": "69 см", 
    "Рукав": "62 см"
  },
  "L": {
    "Грудь": "92-96 см",
    "Талия": "72-76 см",
    "Бедра": "98-102 см",
    "Длина": "71 см",
    "Рукав": "64 см"
  },
  "XL": {
    "Грудь": "96-100 см",
    "Талия": "76-80 см",
    "Бедра": "102-106 см",
    "Длина": "73 см",
    "Рукав": "66 см"
  }
}'::jsonb
WHERE category IN ('tops', 'shirts', 'sweaters', 'hoodies', 'jackets', 'blazers');

-- Update measurements for dresses
UPDATE products 
SET measurements = '{
  "XS": {
    "Грудь": "80-84 см",
    "Талия": "60-64 см",
    "Бедра": "86-90 см", 
    "Длина": "95 см"
  },
  "S": {
    "Грудь": "84-88 см",
    "Талия": "64-68 см",
    "Бедра": "90-94 см",
    "Длина": "97 см"
  },
  "M": {
    "Грудь": "88-92 см", 
    "Талия": "68-72 см",
    "Бедра": "94-98 см",
    "Длина": "99 см"
  },
  "L": {
    "Грудь": "92-96 см",
    "Талия": "72-76 см",
    "Бедра": "98-102 см",
    "Длина": "101 см"
  },
  "XL": {
    "Грудь": "96-100 см",
    "Талия": "76-80 см", 
    "Бедра": "102-106 см",
    "Длина": "103 см"
  }
}'::jsonb
WHERE category IN ('dresses');

-- Update measurements for pants/bottoms
UPDATE products 
SET measurements = '{
  "XS": {
    "Талия": "60-64 см",
    "Бедра": "86-90 см",
    "Длина по внутр. шву": "76 см",
    "Общая длина": "100 см"
  },
  "S": {
    "Талия": "64-68 см", 
    "Бедра": "90-94 см",
    "Длина по внутр. шву": "78 см",
    "Общая длина": "102 см"
  },
  "M": {
    "Талия": "68-72 см",
    "Бедра": "94-98 см",
    "Длина по внутр. шву": "80 см",
    "Общая длина": "104 см"
  },
  "L": {
    "Талия": "72-76 см",
    "Бедра": "98-102 см",
    "Длина по внутр. шву": "82 см", 
    "Общая длина": "106 см"
  },
  "XL": {
    "Талия": "76-80 см",
    "Бедра": "102-106 см",
    "Длина по внутр. шву": "84 см",
    "Общая длина": "108 см"
  }
}'::jsonb
WHERE category IN ('pants', 'jeans', 'trousers', 'shorts', 'bottoms');

-- Update measurements for skirts
UPDATE products 
SET measurements = '{
  "XS": {
    "Талия": "60-64 см",
    "Бедра": "86-90 см",
    "Длина": "45 см"
  },
  "S": {
    "Талия": "64-68 см",
    "Бедра": "90-94 см", 
    "Длина": "46 см"
  },
  "M": {
    "Талия": "68-72 см",
    "Бедра": "94-98 см",
    "Длина": "47 см"
  },
  "L": {
    "Талия": "72-76 см",
    "Бедра": "98-102 см",
    "Длина": "48 см"
  },
  "XL": {
    "Талия": "76-80 см",
    "Бедра": "102-106 см",
    "Длина": "49 см"
  }
}'::jsonb
WHERE category IN ('skirts');

-- Update measurements for accessories (bags, etc.)
UPDATE products 
SET measurements = '{
  "ONE SIZE": {
    "Ширина": "35 см",
    "Высота": "25 см", 
    "Глубина": "12 см",
    "Длина ручек": "60 см"
  }
}'::jsonb
WHERE category IN ('accessories', 'bags', 'handbags');

-- Update measurements for shoes
UPDATE products 
SET measurements = '{
  "36": {
    "Длина стопы": "23 см",
    "Ширина": "8.5 см"
  },
  "37": {
    "Длина стопы": "23.5 см",
    "Ширина": "8.7 см"
  },
  "38": {
    "Длина стопы": "24.5 см",
    "Ширина": "9 см"
  },
  "39": {
    "Длина стопы": "25 см", 
    "Ширина": "9.2 см"
  },
  "40": {
    "Длина стопы": "25.5 см",
    "Ширина": "9.5 см"
  },
  "41": {
    "Длина стопы": "26.5 см",
    "Ширина": "9.7 см"
  }
}'::jsonb
WHERE category IN ('shoes', 'footwear', 'sneakers', 'boots');