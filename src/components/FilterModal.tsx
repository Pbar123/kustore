import React, { useState, useEffect } from 'react';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export interface FilterState {
  priceRange: [number, number];
  sizes: string[];
  brands: string[];
  categories: string[];
  isNew: boolean | null;
  isOnSale: boolean | null;
  inStock: boolean | null;
}

export const defaultFilters: FilterState = {
  priceRange: [0, 1000],
  sizes: [],
  brands: [],
  categories: [],
  isNew: null,
  isOnSale: null,
  inStock: null,
};

export function FilterModal({ isOpen, onClose, products, onFiltersChange, currentFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(currentFilters);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: false,
    size: false,
    brand: false,
    status: false,
  });

  // Extract unique values from products database
  const availableCategories = Array.from(new Set(products.map(p => p.category))).sort();
  const availableBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort();
  
  // Get sizes based on selected categories or all sizes if no category selected
  const getAvailableSizes = () => {
    const allSizes = Array.from(new Set(products.flatMap(p => p.sizes)));
    
    // Group sizes by type for better organization
    const clothingSizes = allSizes.filter(size => ['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(size));
    const sortedClothingSizes = clothingSizes.sort((a, b) => {
      const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      return order.indexOf(a) - order.indexOf(b);
    });
    
    const pantsSizes = allSizes.filter(size => /^\d+$/.test(size) && parseInt(size) >= 26 && parseInt(size) <= 50);
    const shoeSizes = allSizes.filter(size => /^\d+$/.test(size) && parseInt(size) >= 35 && parseInt(size) <= 50);
    const otherSizes = allSizes.filter(size => 
      !sortedClothingSizes.includes(size) && 
      !pantsSizes.includes(size) && 
      !shoeSizes.includes(size)
    );
    
    return {
      clothing: sortedClothingSizes,
      pants: pantsSizes.sort((a, b) => parseInt(a) - parseInt(b)),
      shoes: shoeSizes.sort((a, b) => parseInt(a) - parseInt(b)),
      other: otherSizes.sort()
    };
  };
  
  const availableSizes = getAvailableSizes();
  
  const minPrice = Math.min(...products.map(p => p.real_price));
  const maxPrice = Math.max(...products.map(p => p.real_price));

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (index: number, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    if (index === 0 && value > newRange[1]) {
      newRange[1] = value;
    }
    if (index === 1 && value < newRange[0]) {
      newRange[0] = value;
    }
    setFilters(prev => ({ ...prev, priceRange: newRange }));
  };

  const toggleArrayFilter = (key: 'sizes' | 'brands', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const toggleCategoryFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(item => item !== category)
        : [...prev.categories, category]
    }));
  };
  const handleBooleanFilter = (key: 'isNew' | 'isOnSale', value: boolean | null) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value
    }));
  };

  const applyFilters = () => {
    onFiltersChange(filters);
    onClose();
  };

  const resetFilters = () => {
    const resetState = {
      ...defaultFilters,
      priceRange: [minPrice, maxPrice] as [number, number]
    };
    setFilters(resetState);
    onFiltersChange(resetState);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    const minProductPrice = Math.min(...products.map(p => p.real_price));
    const maxProductPrice = Math.max(...products.map(p => p.real_price));
    if (filters.priceRange[0] > minProductPrice || filters.priceRange[1] < maxProductPrice) count++;
    if (filters.categories.length > 0) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.isNew !== null) count++;
    if (filters.isOnSale !== null) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <h2 className="text-xl font-bold text-gray-900">Фильтры</h2>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Price Range */}
          <div className="border-b border-gray-100 pb-4">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left py-2"
            >
              <h3 className="text-base font-medium text-gray-900">Цена</h3>
              {expandedSections.price ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
            </button>
            {expandedSections.price && (
              <div className="mt-3 space-y-4">
                {/* Input fields */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">от</span>
                    <input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                      className="w-20 px-2 py-1 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-center"
                      min={minPrice}
                      max={maxPrice}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">до</span>
                    <input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                      className="w-20 px-2 py-1 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-center"
                      min={minPrice}
                      max={maxPrice}
                    />
                  </div>
                </div>
                
                {/* Dual Range Slider */}
                <div className="dual-range-slider">
                  <div className="relative h-1.5 bg-gray-200 rounded-full">
                    {/* Active range track */}
                    <div 
                      className="absolute h-1.5 bg-blue-500 rounded-full"
                      style={{
                        left: `${((filters.priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                        width: `${((filters.priceRange[1] - filters.priceRange[0]) / (maxPrice - minPrice)) * 100}%`
                      }}
                    />
                    
                    {/* Min range slider */}
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                      className="range-min"
                    />
                    
                    {/* Max range slider */}
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                      className="range-max"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="border-b border-gray-100 pb-4">
            <button
              onClick={() => toggleSection('category')}
              className="flex items-center justify-between w-full text-left py-2"
            >
              <h3 className="text-base font-medium text-gray-900">Категория</h3>
              {expandedSections.category ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
            </button>
            {expandedSections.category && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {availableCategories.map(category => (
                  <label key={category} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => toggleCategoryFilter(category)}
                      className="rounded border-gray-300 text-black focus:ring-black h-3 w-3"
                    />
                    <span className="text-gray-700 capitalize text-sm">{category}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Sizes */}
          <div className="border-b border-gray-100 pb-4">
            <button
              onClick={() => toggleSection('size')}
              className="flex items-center justify-between w-full text-left py-2"
            >
              <h3 className="text-base font-medium text-gray-900">Размер</h3>
              {expandedSections.size ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
            </button>
            {expandedSections.size && (
              <div className="mt-3">
                <div className="space-y-3">
                  {availableSizes.clothing.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-600 mb-2">Одежда</h4>
                      <div className="flex flex-wrap gap-1">
                        {availableSizes.clothing.map(size => (
                          <button
                            key={size}
                            onClick={() => toggleArrayFilter('sizes', size)}
                            className={`px-2 py-1 border rounded text-xs transition-colors ${
                              filters.sizes.includes(size)
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {availableSizes.pants.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-600 mb-2">Брюки</h4>
                      <div className="flex flex-wrap gap-1">
                        {availableSizes.pants.map(size => (
                          <button
                            key={size}
                            onClick={() => toggleArrayFilter('sizes', size)}
                            className={`px-2 py-1 border rounded text-xs transition-colors ${
                              filters.sizes.includes(size)
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {availableSizes.shoes.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-600 mb-2">Обувь</h4>
                      <div className="flex flex-wrap gap-1">
                        {availableSizes.shoes.map(size => (
                          <button
                            key={size}
                            onClick={() => toggleArrayFilter('sizes', size)}
                            className={`px-2 py-1 border rounded text-xs transition-colors ${
                              filters.sizes.includes(size)
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {availableSizes.other.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-600 mb-2">Аксессуары</h4>
                      <div className="flex flex-wrap gap-1">
                        {availableSizes.other.map(size => (
                          <button
                            key={size}
                            onClick={() => toggleArrayFilter('sizes', size)}
                            className={`px-2 py-1 border rounded text-xs transition-colors ${
                              filters.sizes.includes(size)
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Brands */}
          <div className="border-b border-gray-100 pb-4">
            <button
              onClick={() => toggleSection('brand')}
              className="flex items-center justify-between w-full text-left py-2"
            >
              <h3 className="text-base font-medium text-gray-900">Бренд</h3>
              {expandedSections.brand ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
            </button>
            {expandedSections.brand && (
              <div className="mt-3 space-y-2">
                {availableBrands.map(brand => (
                  <label key={brand} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => toggleArrayFilter('brands', brand)}
                      className="rounded border-gray-300 text-black focus:ring-black h-3 w-3"
                    />
                    <span className="text-gray-700 text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <button
              onClick={() => toggleSection('status')}
              className="flex items-center justify-between w-full text-left py-2"
            >
              <h3 className="text-base font-medium text-gray-900">Статус</h3>
              {expandedSections.status ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
            </button>
            {expandedSections.status && (
              <div className="mt-3 space-y-3">
                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-2">Новинки</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBooleanFilter('isNew', true)}
                      className={`px-3 py-1 border rounded text-xs transition-colors ${
                        filters.isNew === true
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                      }`}
                    >
                      Только новинки
                    </button>
                    <button
                      onClick={() => handleBooleanFilter('isNew', false)}
                      className={`px-3 py-1 border rounded text-xs transition-colors ${
                        filters.isNew === false
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                      }`}
                    >
                      Исключить новинки
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-2">Наличие</h4>
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.inStock === true}
                      onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked ? true : null }))}
                      className="rounded border-gray-300 text-black focus:ring-black h-3 w-3"
                    />
                    <span className="text-gray-700 text-sm">Только в наличии</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <button
            onClick={resetFilters}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Сбросить все
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Применить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}