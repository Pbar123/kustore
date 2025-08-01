import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { FilterState } from '../components/FilterModal';
import { SortOption } from '../components/SortDropdown';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products from Supabase...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched products:', data);

      if (!data || data.length === 0) {
        console.warn('No products found in database');
        setProducts([]);
        return;
      }

      // Transform database format to frontend format
      const transformedProducts: Product[] = data.map(item => ({
        id: item.id,
        name: item.name,
        real_price: item.real_price,
        fake_original_price: item.fake_original_price,
        image_url: item.image_url,
        images: item.images || [item.image_url], // Сохраняем оригинальные URL из базы данных
        // Debug: логируем изображения для каждого товара
        image_alt_texts: item.image_alt_texts || [item.name],
        category: item.category,
        subcategory: item.subcategory,
        color: item.color,
        brand: item.brand,
        description: item.description,
        sizes: item.sizes,
        in_stock: item.in_stock,
        is_new: item.is_new,
        created_at: item.created_at,
        updated_at: item.updated_at,
        measurements: item.measurements || {},
        stock_quantity: item.stock_quantity || {},
        features: item.features || []
      }));

      // Debug: логируем все изображения
      transformedProducts.forEach(product => {
        console.log(`Product ${product.name}:`, {
          image_url: product.image_url,
          images: product.images
        });
      });

      setProducts(transformedProducts);
      console.log('Transformed products:', transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getNewProducts = () => {
    return products.filter(product => product.is_new);
  };

  const getProductsByCategory = (category: string) => {
    console.log('Getting products by category:', category, 'Total products:', products.length);
    if (category === 'all') return products;
    const filtered = products.filter(product => product.category === category);
    console.log('Filtered by category result:', filtered.length);
    return filtered;
  };

  const applyFilters = (products: Product[], filters: FilterState): Product[] => {
    return products.filter(product => {
      // Price filter
      const price = product.real_price;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Size filter
      if (filters.sizes.length > 0) {
        const hasMatchingSize = filters.sizes.some(size => product.sizes.includes(size));
        if (!hasMatchingSize) return false;
      }

      // Brand filter (mock implementation)
      if (filters.brands.length > 0) {
        if (!filters.brands.includes(product.brand || '')) {
          return false;
        }
      }

      // Category filter
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(product.category)) {
          return false;
        }
      }

      return true;
    });
  };
  const sortProducts = (products: Product[], sortBy: SortOption): Product[] => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      case 'price-low':
        return sorted.sort((a, b) => a.real_price - b.real_price);
      
      case 'price-high':
        return sorted.sort((a, b) => b.real_price - a.real_price);
      
      case 'popular':
        // For now, sort by newest as we don't have popularity data
        // In the future, this could be based on order count, views, etc.
        return sorted.sort((a, b) => {
          // Prioritize new items for popularity
          if (a.is_new && !b.is_new) return -1;
          if (!a.is_new && b.is_new) return 1;
          // Then by creation date
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      
      default:
        return sorted;
    }
  };

  return {
    products,
    loading,
    error,
    getNewProducts,
    getProductsByCategory,
    applyFilters,
    sortProducts,
    refetch: fetchProducts
  };
}