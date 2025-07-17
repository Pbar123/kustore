/*
  # Add support for multiple product images

  1. Schema Changes
    - Add `images` array column to store multiple image URLs
    - Keep `image_url` for backward compatibility (will be the main/first image)
    - Add `image_alt_texts` array for accessibility

  2. Data Migration
    - Move existing single images to the new images array
    - Update existing products to use the new structure
*/

-- Add new columns for multiple images
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS image_alt_texts text[] DEFAULT '{}';

-- Migrate existing single images to the new array format
UPDATE products 
SET images = ARRAY[image_url],
    image_alt_texts = ARRAY[name || ' - Main Image']
WHERE images = '{}' OR images IS NULL;

-- Update existing products with multiple sample images
UPDATE products SET 
  images = CASE 
    WHEN category = 'T-Shirts' THEN ARRAY[
      'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
    WHEN category = 'Jeans' THEN ARRAY[
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7679471/pexels-photo-7679471.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
    WHEN category = 'Jackets' THEN ARRAY[
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
    WHEN category = 'Sweaters' THEN ARRAY[
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7679471/pexels-photo-7679471.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
    WHEN category = 'Dresses' THEN ARRAY[
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7679471/pexels-photo-7679471.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
    WHEN category = 'Shirts' THEN ARRAY[
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
    WHEN category = 'Accessories' THEN ARRAY[
      'https://images.pexels.com/photos/7679471/pexels-photo-7679471.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
    WHEN category = 'Shoes' THEN ARRAY[
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7679471/pexels-photo-7679471.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
    WHEN category = 'Skirts' THEN ARRAY[
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7679471/pexels-photo-7679471.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
    ELSE ARRAY[image_url]
  END,
  image_alt_texts = CASE 
    WHEN category = 'T-Shirts' THEN ARRAY[
      name || ' - Front View',
      name || ' - Back View', 
      name || ' - Side View',
      name || ' - Detail View'
    ]
    WHEN category = 'Jeans' THEN ARRAY[
      name || ' - Front View',
      name || ' - Back View',
      name || ' - Side View', 
      name || ' - Detail View',
      name || ' - Texture Close-up'
    ]
    WHEN category = 'Jackets' THEN ARRAY[
      name || ' - Front View',
      name || ' - Back View',
      name || ' - Side View',
      name || ' - Interior View',
      name || ' - Detail View',
      name || ' - Styled Look'
    ]
    WHEN category = 'Sweaters' THEN ARRAY[
      name || ' - Front View',
      name || ' - Back View',
      name || ' - Side View',
      name || ' - Detail View',
      name || ' - Texture Close-up'
    ]
    WHEN category = 'Dresses' THEN ARRAY[
      name || ' - Front View',
      name || ' - Back View',
      name || ' - Side View',
      name || ' - Detail View',
      name || ' - Styled Look',
      name || ' - Full Length',
      name || ' - Movement View'
    ]
    WHEN category = 'Shirts' THEN ARRAY[
      name || ' - Front View',
      name || ' - Back View',
      name || ' - Side View',
      name || ' - Detail View',
      name || ' - Collar Close-up'
    ]
    WHEN category = 'Accessories' THEN ARRAY[
      name || ' - Main View',
      name || ' - Detail View',
      name || ' - Texture Close-up',
      name || ' - Styled Look',
      name || ' - Color Variation',
      name || ' - Size Reference',
      name || ' - Material Close-up',
      name || ' - Usage Example'
    ]
    WHEN category = 'Shoes' THEN ARRAY[
      name || ' - Side View',
      name || ' - Front View',
      name || ' - Back View',
      name || ' - Sole View',
      name || ' - Detail View',
      name || ' - Styled Look'
    ]
    WHEN category = 'Skirts' THEN ARRAY[
      name || ' - Front View',
      name || ' - Back View',
      name || ' - Side View',
      name || ' - Detail View',
      name || ' - Movement View',
      name || ' - Full Length',
      name || ' - Styled Look'
    ]
    ELSE ARRAY[name || ' - Main Image']
  END;

-- Update the main image_url to be the first image in the array
UPDATE products 
SET image_url = images[1] 
WHERE array_length(images, 1) > 0;