import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const images = product.images || [product.image_url];
  const altTexts = product.image_alt_texts || [product.name];

  // Auto-cycle through images on hover
  React.useEffect(() => {
    if (!isHovered || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCurrentImageIndex(0);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
  };

  return (
    <div 
      className="group cursor-pointer"
      onClick={() => onProductClick(product)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
        <img
          src={images[currentImageIndex]}
          alt={altTexts[currentImageIndex] || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = '/images/products/placeholder.jpg';
          }}
        />
        {/* Image indicator dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.slice(0, 5).map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  currentImageIndex === index
                    ? 'bg-white'
                    : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
            {images.length > 5 && (
              <div className="text-white text-xs bg-black bg-opacity-50 px-1 rounded">
                +{images.length - 5}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="space-y-2">
        {product.is_new && (
          <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded">
            NEW
          </span>
        )}
        {product.is_on_sale && (
          <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded ml-1">
            SALE
          </span>
        )}
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center space-x-2">
          {product.is_on_sale && product.sale_price ? (
            <>
              <span className="text-sm text-red-600 font-medium">{product.sale_price} руб.</span>
              <span className="text-sm text-gray-400 line-through">{product.price} руб.</span>
            </>
          ) : (
            <span className="text-sm text-gray-600">{product.price} руб.</span>
          )}
        </div>
      </div>
    </div>
  );
}