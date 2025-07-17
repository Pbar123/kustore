import React from 'react';
import { Filter } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  loading?: boolean;
  onFilterClick?: () => void;
  activeFiltersCount?: number;
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  loading = false,
  onFilterClick,
  activeFiltersCount = 0
}: CategoryFilterProps) {
  
  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 mb-8">
        <div className="w-full mb-2 text-sm text-gray-500">
          Загрузка категорий...
        </div>
        <div className="px-4 py-2 bg-gray-200 rounded-lg animate-pulse">
          <div className="h-4 w-8 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.length > 0 && (
        <div className="w-full mb-2 text-sm text-gray-500">
          Доступные категории: {categories.join(', ')}
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {onFilterClick && (
          <button
            onClick={onFilterClick}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-black transition-colors relative"
          >
            <Filter className="h-4 w-4" />
            <span>Фильтры</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        )}
      </div>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
            selectedCategory === category
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}