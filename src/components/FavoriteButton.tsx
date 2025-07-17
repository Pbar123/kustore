import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ productId, className = '', size = 'md' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { state: authState } = useAuth();
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    if (!authState.isAuthenticated) {
      // Можно показать уведомление о необходимости авторизации
      return;
    }
    
    await toggleFavorite(productId);
  };

  const isInFavorites = isFavorite(productId);

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-colors hover:bg-gray-100 ${className}`}
      title={isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <Heart 
        className={`${sizeClasses[size]} transition-colors ${
          isInFavorites 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-400 hover:text-red-500'
        }`}
      />
    </button>
  );
}