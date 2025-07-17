/*
  # Update product images to use local paths

  1. Changes
    - Update all product images to use local file paths instead of external URLs
    - Maintain multiple images per product for gallery functionality
    - Use organized folder structure by category

  2. Image Structure
    - All images stored in /images/products/{category}/
    - Multiple images per product for different views
    - Consistent naming convention
*/

-- Update products with local image paths
UPDATE products SET 
  image_url = '/images/products/' || lower(category) || '/' || 
    CASE 
      WHEN name ILIKE '%белый%' OR name ILIKE '%white%' THEN 'white-'
      WHEN name ILIKE '%черный%' OR name ILIKE '%black%' THEN 'black-'
      WHEN name ILIKE '%серый%' OR name ILIKE '%gray%' THEN 'gray-'
      WHEN name ILIKE '%синий%' OR name ILIKE '%blue%' THEN 'blue-'
      ELSE 'product-'
    END || id::text || '-main.jpg',
  images = ARRAY[
    '/images/products/' || lower(category) || '/' || 
      CASE 
        WHEN name ILIKE '%белый%' OR name ILIKE '%white%' THEN 'white-'
        WHEN name ILIKE '%черный%' OR name ILIKE '%black%' THEN 'black-'
        WHEN name ILIKE '%серый%' OR name ILIKE '%gray%' THEN 'gray-'
        WHEN name ILIKE '%синий%' OR name ILIKE '%blue%' THEN 'blue-'
        ELSE 'product-'
      END || id::text || '-main.jpg',
    '/images/products/' || lower(category) || '/' || 
      CASE 
        WHEN name ILIKE '%белый%' OR name ILIKE '%white%' THEN 'white-'
        WHEN name ILIKE '%черный%' OR name ILIKE '%black%' THEN 'black-'
        WHEN name ILIKE '%серый%' OR name ILIKE '%gray%' THEN 'gray-'
        WHEN name ILIKE '%синий%' OR name ILIKE '%blue%' THEN 'blue-'
        ELSE 'product-'
      END || id::text || '-front.jpg',
    '/images/products/' || lower(category) || '/' || 
      CASE 
        WHEN name ILIKE '%белый%' OR name ILIKE '%white%' THEN 'white-'
        WHEN name ILIKE '%черный%' OR name ILIKE '%black%' THEN 'black-'
        WHEN name ILIKE '%серый%' OR name ILIKE '%gray%' THEN 'gray-'
        WHEN name ILIKE '%синий%' OR name ILIKE '%blue%' THEN 'blue-'
        ELSE 'product-'
      END || id::text || '-back.jpg',
    '/images/products/' || lower(category) || '/' || 
      CASE 
        WHEN name ILIKE '%белый%' OR name ILIKE '%white%' THEN 'white-'
        WHEN name ILIKE '%черный%' OR name ILIKE '%black%' THEN 'black-'
        WHEN name ILIKE '%серый%' OR name ILIKE '%gray%' THEN 'gray-'
        WHEN name ILIKE '%синий%' OR name ILIKE '%blue%' THEN 'blue-'
        ELSE 'product-'
      END || id::text || '-detail.jpg'
  ];

-- Update specific products with more descriptive local paths
UPDATE products SET 
  image_url = '/images/products/shirts/white-classic-shirt-main.jpg',
  images = ARRAY[
    '/images/products/shirts/white-classic-shirt-main.jpg',
    '/images/products/shirts/white-classic-shirt-front.jpg',
    '/images/products/shirts/white-classic-shirt-back.jpg',
    '/images/products/shirts/white-classic-shirt-detail.jpg'
  ]
WHERE name = 'Классическая белая рубашка';

UPDATE products SET 
  image_url = '/images/products/dresses/black-elegant-dress-main.jpg',
  images = ARRAY[
    '/images/products/dresses/black-elegant-dress-main.jpg',
    '/images/products/dresses/black-elegant-dress-front.jpg',
    '/images/products/dresses/black-elegant-dress-back.jpg',
    '/images/products/dresses/black-elegant-dress-styled.jpg'
  ]
WHERE name = 'Элегантное черное платье';

UPDATE products SET 
  image_url = '/images/products/jeans/classic-jeans-main.jpg',
  images = ARRAY[
    '/images/products/jeans/classic-jeans-main.jpg',
    '/images/products/jeans/classic-jeans-front.jpg',
    '/images/products/jeans/classic-jeans-back.jpg',
    '/images/products/jeans/classic-jeans-detail.jpg'
  ]
WHERE name = 'Классические джинсы';

UPDATE products SET 
  image_url = '/images/products/sweaters/knit-sweater-main.jpg',
  images = ARRAY[
    '/images/products/sweaters/knit-sweater-main.jpg',
    '/images/products/sweaters/knit-sweater-front.jpg',
    '/images/products/sweaters/knit-sweater-texture.jpg'
  ]
WHERE name = 'Уютный вязаный свитер';

UPDATE products SET 
  image_url = '/images/products/skirts/tweed-mini-skirt-main.jpg',
  images = ARRAY[
    '/images/products/skirts/tweed-mini-skirt-main.jpg',
    '/images/products/skirts/tweed-mini-skirt-front.jpg',
    '/images/products/skirts/tweed-mini-skirt-styled.jpg'
  ]
WHERE name = 'Мини-юбка из твида';

UPDATE products SET 
  image_url = '/images/products/bags/leather-tote-bag-main.jpg',
  images = ARRAY[
    '/images/products/bags/leather-tote-bag-main.jpg',
    '/images/products/bags/leather-tote-bag-detail.jpg',
    '/images/products/bags/leather-tote-bag-interior.jpg'
  ]
WHERE name = 'Кожаная сумка-тоут';

-- Update existing test products with local paths
UPDATE products SET 
  image_url = CASE 
    WHEN category = 'T-Shirts' THEN '/images/products/shirts/tshirt-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg'
    WHEN category = 'Jeans' THEN '/images/products/jeans/jeans-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg'
    WHEN category = 'Jackets' THEN '/images/products/jackets/jacket-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg'
    WHEN category = 'Sweaters' THEN '/images/products/sweaters/sweater-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg'
    WHEN category = 'Dresses' THEN '/images/products/dresses/dress-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg'
    WHEN category = 'Shirts' THEN '/images/products/shirts/shirt-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg'
    WHEN category = 'Accessories' THEN '/images/products/accessories/accessory-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg'
    WHEN category = 'Shoes' THEN '/images/products/shoes/shoes-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg'
    WHEN category = 'Skirts' THEN '/images/products/skirts/skirt-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg'
    ELSE '/images/products/general/product-' || id::text || '-main.jpg'
  END,
  images = CASE 
    WHEN category = 'T-Shirts' THEN ARRAY[
      '/images/products/shirts/tshirt-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg',
      '/images/products/shirts/tshirt-' || LOWER(REPLACE(name, ' ', '-')) || '-front.jpg',
      '/images/products/shirts/tshirt-' || LOWER(REPLACE(name, ' ', '-')) || '-back.jpg'
    ]
    WHEN category = 'Jeans' THEN ARRAY[
      '/images/products/jeans/jeans-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg',
      '/images/products/jeans/jeans-' || LOWER(REPLACE(name, ' ', '-')) || '-front.jpg',
      '/images/products/jeans/jeans-' || LOWER(REPLACE(name, ' ', '-')) || '-back.jpg',
      '/images/products/jeans/jeans-' || LOWER(REPLACE(name, ' ', '-')) || '-detail.jpg'
    ]
    WHEN category = 'Jackets' THEN ARRAY[
      '/images/products/jackets/jacket-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg',
      '/images/products/jackets/jacket-' || LOWER(REPLACE(name, ' ', '-')) || '-front.jpg',
      '/images/products/jackets/jacket-' || LOWER(REPLACE(name, ' ', '-')) || '-back.jpg'
    ]
    WHEN category = 'Sweaters' THEN ARRAY[
      '/images/products/sweaters/sweater-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg',
      '/images/products/sweaters/sweater-' || LOWER(REPLACE(name, ' ', '-')) || '-front.jpg',
      '/images/products/sweaters/sweater-' || LOWER(REPLACE(name, ' ', '-')) || '-texture.jpg'
    ]
    WHEN category = 'Dresses' THEN ARRAY[
      '/images/products/dresses/dress-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg',
      '/images/products/dresses/dress-' || LOWER(REPLACE(name, ' ', '-')) || '-front.jpg',
      '/images/products/dresses/dress-' || LOWER(REPLACE(name, ' ', '-')) || '-styled.jpg'
    ]
    WHEN category = 'Shirts' THEN ARRAY[
      '/images/products/shirts/shirt-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg',
      '/images/products/shirts/shirt-' || LOWER(REPLACE(name, ' ', '-')) || '-front.jpg',
      '/images/products/shirts/shirt-' || LOWER(REPLACE(name, ' ', '-')) || '-detail.jpg'
    ]
    WHEN category = 'Accessories' THEN ARRAY[
      '/images/products/accessories/accessory-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg',
      '/images/products/accessories/accessory-' || LOWER(REPLACE(name, ' ', '-')) || '-detail.jpg'
    ]
    WHEN category = 'Shoes' THEN ARRAY[
      '/images/products/shoes/shoes-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg',
      '/images/products/shoes/shoes-' || LOWER(REPLACE(name, ' ', '-')) || '-side.jpg',
      '/images/products/shoes/shoes-' || LOWER(REPLACE(name, ' ', '-')) || '-sole.jpg'
    ]
    WHEN category = 'Skirts' THEN ARRAY[
      '/images/products/skirts/skirt-' || LOWER(REPLACE(name, ' ', '-')) || '-main.jpg',
      '/images/products/skirts/skirt-' || LOWER(REPLACE(name, ' ', '-')) || '-front.jpg',
      '/images/products/skirts/skirt-' || LOWER(REPLACE(name, ' ', '-')) || '-styled.jpg'
    ]
    ELSE ARRAY['/images/products/general/product-' || id::text || '-main.jpg']
  END
WHERE name NOT IN ('Классическая белая рубашка', 'Элегантное черное платье', 'Классические джинсы', 'Уютный вязаный свитер', 'Мини-юбка из твида', 'Кожаная сумка-тоут');