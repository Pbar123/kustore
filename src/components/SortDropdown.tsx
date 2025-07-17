import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions = [
  { value: 'newest' as SortOption, label: 'По новизне' },
  { value: 'price-low' as SortOption, label: 'Цена: по возрастанию' },
  { value: 'price-high' as SortOption, label: 'Цена: по убыванию' },
  { value: 'popular' as SortOption, label: 'По популярности' },
];

export function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = sortOptions.find(option => option.value === currentSort);

  const handleSelect = (value: SortOption) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-black transition-colors bg-white"
      >
        <span className="text-sm">{currentOption?.label}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  currentSort === option.value
                    ? 'bg-gray-100 font-medium text-black'
                    : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}