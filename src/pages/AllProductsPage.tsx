import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CategoryFilter } from '../components/CategoryFilter';
import { FilterModal, FilterState, defaultFilters } from '../components/FilterModal';
import { SortDropdown, SortOption } from '../components/SortDropdown';
import { ProductGrid } from '../components/ProductGrid';
import { ProductModal } from '../components/ProductModal';
import { CartSidebar } from '../components/CartSidebar';
import { SearchBar } from '../components/SearchBar';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';

export function AllProductsPage() {
  const { products, loading, error, applyFilters, sortProducts } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<FilterState>(() => {
    const minPrice = products.length > 0 ? Math.min(...products.map(p => p.price)) : 0;
    const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000;
    return {
      ...defaultFilters,
      priceRange: [minPrice, maxPrice]
    };
  });

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    return uniqueCategories.sort();
  }, []);

  // Update price range when products load
  React.useEffect(() => {
    if (products.length > 0) {
      const minPrice = Math.min(...products.map(p => p.real_price));
      const maxPrice = Math.max(...products.map(p => p.real_price));
      setFilters(prev => ({
        ...prev,
        priceRange: [minPrice, maxPrice]
      }));
    }
  }, [products]);
  const filteredProducts = useMemo(() => {
    console.log('Filtering products:', {
      totalProducts: products.length,
      selectedCategory,
      searchTerm,
      categories: Array.from(new Set(products.map(p => p.category)))
    });
    
    // First apply category and search filters
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    
    // Then apply advanced filters
    filtered = applyFilters(filtered, filters);
    
    // Finally apply sorting
    filtered = sortProducts(filtered, sortBy);
    
    console.log('Filtered products:', filtered.length);
    return filtered;
  }, [products, selectedCategory, searchTerm, filters, sortBy, applyFilters, sortProducts]);

  const getActiveFiltersCount = () => {
    let count = 0;
    const minPrice = products.length > 0 ? Math.min(...products.map(p => p.real_price)) : 0;
    const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.real_price)) : 1000;
    
    if (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) count++;
    if (filters.categories.length > 0) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.isNew !== null) count++;
    if (filters.inStock !== null) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">Загрузка товаров...</div>
          <div className="text-sm text-gray-400">Подключение к базе данных</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <div className="text-lg text-red-600 mb-2">Ошибка загрузки товаров</div>
          <div className="text-sm text-gray-600 mb-4">{error}</div>
          <div className="text-xs text-gray-500">
            Убедитесь, что подключение к Supabase настроено правильно
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <div className="text-lg text-gray-600 mb-2">Товары не найдены</div>
          <div className="text-sm text-gray-500 mb-4">
            База данных пуста или товары еще не добавлены
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              to="/catalog"
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Назад в каталог"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Весь ассортимент</h1>
          </div>
          <p className="text-lg text-gray-600">Полная коллекция нашей одежды</p>
        </div>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            loading={loading}
            onFilterClick={() => setIsFilterOpen(true)}
            activeFiltersCount={getActiveFiltersCount()}
          />
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Сортировка:</span>
            <SortDropdown
              currentSort={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'Товары не найдены по запросу' : 'Товары в данной категории отсутствуют'}
            </p>
          </div>
        ) : (
          <ProductGrid
            products={filteredProducts}
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

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        products={products}
        onFiltersChange={setFilters}
        currentFilters={filters}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}