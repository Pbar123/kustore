import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { FavoriteButton } from './FavoriteButton';

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
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2 relative">
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
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.slice(0, 5).map((_, index) => (
              <div
                key={index}
                className={`w-1 h-1 rounded-full transition-all ${
                  currentImageIndex === index
                    ? 'bg-white'
                    : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
            {images.length > 5 && (
              <div className="text-white text-xs bg-black bg-opacity-50 px-0.5 rounded text-xs">
                +{images.length - 5}
              </div>
            )}
          </div>
        )}
        
        {/* Favorite Button */}
        <div className="absolute top-1 right-1">
          <FavoriteButton productId={product.id} size="sm" />
        </div>
      </div>
      <div className="space-y-1">
        {product.is_new && (
          <span className="inline-block bg-black text-white text-xs px-1.5 py-0.5 rounded">
            NEW
          </span>
        )}
        <h3 className="text-xs font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-900 font-medium">{product.real_price} ₽</span>
          <span className="text-xs text-gray-400 line-through">{product.fake_original_price} ₽</span>
        </div>
      </div>
    </div>
  );
}