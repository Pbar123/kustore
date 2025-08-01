import React, { useState, useEffect } from 'react';
import { getYandexDiskDirectUrl, isYandexDiskUrl, createImageFallbacks } from '../utils/yandexDisk';

interface YandexDiskImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  fallbackSrc?: string;
}

export function YandexDiskImage({ 
  src, 
  alt, 
  className = '', 
  onError, 
  onLoad,
  fallbackSrc = '/images/products/placeholder.jpg'
}: YandexDiskImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Создаем список fallback URL
  const fallbackUrls = React.useMemo(() => {
    if (isYandexDiskUrl(src)) {
      return createImageFallbacks(src);
    }
    return [src, fallbackSrc];
  }, [src, fallbackSrc]);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setFallbackIndex(0);
    
    // Обрабатываем URL если это Яндекс.Диск
    if (isYandexDiskUrl(src)) {
      const processedUrl = getYandexDiskDirectUrl(src);
      setCurrentSrc(processedUrl);
    } else {
      setCurrentSrc(src);
    }
  }, [src]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`Ошибка загрузки изображения: ${currentSrc}`);
    
    // Пробуем следующий fallback URL
    if (fallbackIndex < fallbackUrls.length - 1) {
      const nextIndex = fallbackIndex + 1;
      setFallbackIndex(nextIndex);
      setCurrentSrc(fallbackUrls[nextIndex]);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
    
    onError?.(e);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.(e);
  };

  // Показываем placeholder во время загрузки
  if (isLoading && !hasError) {
    return (
      <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      onLoad={handleImageLoad}
      loading="lazy"
    />
  );
}