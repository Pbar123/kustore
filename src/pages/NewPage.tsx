import React, { useState, useMemo } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { ProductModal } from '../components/ProductModal';
import { CartSidebar } from '../components/CartSidebar';
import { SearchBar } from '../components/SearchBar';
import { SortDropdown, SortOption } from '../components/SortDropdown';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';

export function NewPage() {
  const { products, getNewProducts, sortProducts, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Показываем только новые товары
  const newProducts = useMemo(() => {
    let newItems = getNewProducts();
    
    // Apply search filter
    newItems = newItems.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
    
    // Apply sorting
    return sortProducts(newItems, sortBy);
  }, [searchTerm, sortBy, getNewProducts, sortProducts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Загрузка новинок...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Ошибка загрузки: {error}</div>
      </div>
    );
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Новинки</h1>
          <p className="text-lg text-gray-600">Последние поступления в нашем магазине</p>
        </div>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-gray-600">
            Найдено новинок: {newProducts.length}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Сортировка:</span>
            <SortDropdown
              currentSort={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
        
        {newProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Новинки не найдены</p>
          </div>
        ) : (
          <ProductGrid
            products={newProducts}
            onProductClick={setSelectedProduct}
          />
        )}
      </main>

      <ProductModal
        product={selectedProduct}
        allProducts={products}
        onClose={() => setSelectedProduct(null)}
        onProductClick={setSelectedProduct}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}