/*
  # Add test products to the store

  1. New Tables
    - Adds sample products to the existing `products` table
    
  2. Test Data
    - 12 diverse clothing items across different categories
    - Mix of regular, new, and sale items
    - Various sizes and price points
    - Real product images from Pexels
    
  3. Categories included
    - T-Shirts
    - Jeans
    - Jackets
    - Dresses
    - Sweaters
    - Accessories
*/

-- Clear existing test data if any
DELETE FROM products WHERE name LIKE '%Test%' OR description LIKE '%Perfect for%';

-- Insert comprehensive test data
INSERT INTO products (name, price, sale_price, image_url, category, description, sizes, in_stock, is_new, is_on_sale) VALUES
  (
    'Minimalist White T-Shirt',
    29.99,
    NULL,
    'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg',
    'T-Shirts',
    'Perfect basic white t-shirt made from premium cotton. Clean lines and comfortable fit for everyday wear.',
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    true,
    true,
    false
  ),
  (
    'Classic Black Jeans',
    89.99,
    69.99,
    'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg',
    'Jeans',
    'Timeless black denim jeans with a modern slim fit. Versatile and durable for any occasion.',
    ARRAY['28', '30', '32', '34', '36'],
    true,
    false,
    true
  ),
  (
    'Wool Blend Coat',
    199.99,
    NULL,
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    'Jackets',
    'Elegant wool blend coat perfect for cold weather. Sophisticated design with clean tailoring.',
    ARRAY['S', 'M', 'L', 'XL'],
    true,
    true,
    false
  ),
  (
    'Casual Gray Sweater',
    59.99,
    45.99,
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    'Sweaters',
    'Comfortable gray sweater made from soft knit fabric. Perfect for layering or wearing alone.',
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    true,
    false,
    true
  ),
  (
    'Little Black Dress',
    79.99,
    NULL,
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    'Dresses',
    'Classic little black dress with modern touches. Versatile piece for any wardrobe.',
    ARRAY['XS', 'S', 'M', 'L'],
    true,
    true,
    false
  ),
  (
    'Denim Jacket',
    69.99,
    49.99,
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    'Jackets',
    'Classic denim jacket with vintage-inspired details. Perfect layering piece for any season.',
    ARRAY['S', 'M', 'L', 'XL'],
    true,
    false,
    true
  ),
  (
    'White Button Shirt',
    49.99,
    NULL,
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    'Shirts',
    'Crisp white button-down shirt with clean lines. Essential piece for professional and casual looks.',
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    true,
    false,
    false
  ),
  (
    'Black Skinny Jeans',
    79.99,
    NULL,
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    'Jeans',
    'Modern skinny fit jeans in classic black. Comfortable stretch fabric with contemporary styling.',
    ARRAY['26', '28', '30', '32', '34'],
    true,
    true,
    false
  ),
  (
    'Cashmere Scarf',
    39.99,
    29.99,
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    'Accessories',
    'Luxurious cashmere scarf in neutral tones. Soft texture and elegant drape for sophisticated styling.',
    ARRAY['One Size'],
    true,
    false,
    true
  ),
  (
    'Minimalist Hoodie',
    65.99,
    NULL,
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    'Sweaters',
    'Clean-lined hoodie in premium cotton blend. Comfortable fit with modern minimalist design.',
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    true,
    true,
    false
  ),
  (
    'Tailored Blazer',
    129.99,
    99.99,
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    'Jackets',
    'Sharp tailored blazer for professional and formal occasions. Structured fit with contemporary details.',
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    true,
    false,
    true
  ),
  (
    'Organic Cotton Tee',
    34.99,
    NULL,
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    'T-Shirts',
    'Sustainable organic cotton t-shirt with relaxed fit. Eco-friendly choice without compromising style.',
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    true,
    false,
    false
  );