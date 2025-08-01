import React, { useState, useEffect } from 'react';
import { getYandexDiskDirectUrl, isYandexDiskUrl, createImageFallbacks } from '../utils/yandexDisk';

interface YandexDiskImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  fallbackSrc?: string;
  preserveOriginal?: boolean;
}

export function YandexDiskImage({ 
  src, 
  alt, 
  className = '', 
  onError, 
  onLoad,
  fallbackSrc = '/images/products/placeholder.jpg',
  preserveOriginal = false
}: YandexDiskImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [apiUrl, setApiUrl] = useState<string>('');

  // Создаем список fallback URL
  const fallbackUrls = React.useMemo(() => {
    if (isYandexDiskUrl(src) && !preserveOriginal) {
      return createImageFallbacks(src);
    }
    return [src, fallbackSrc];
  }, [src, fallbackSrc, preserveOriginal]);

  useEffect(() => {
    console.log('YandexDiskImage: Loading image:', src);
    console.log('YandexDiskImage: Is Yandex Disk URL:', isYandexDiskUrl(src));
    console.log('YandexDiskImage: Preserve original:', preserveOriginal);
    
    setIsLoading(true);
    setHasError(false);
    setFallbackIndex(0);
    
    // Обрабатываем URL если это Яндекс.Диск и не нужно сохранять оригинал
    if (isYandexDiskUrl(src) && !preserveOriginal) {
      // Пробуем получить прямую ссылку через API
      fetchYandexDiskImage(src);
    } else {
      console.log('YandexDiskImage: Using original URL:', src);
      setCurrentSrc(src);
    }
  }, [src, preserveOriginal]);

  const fetchYandexDiskImage = async (originalUrl: string) => {
    try {
      console.log('YandexDiskImage: Fetching direct URL for:', originalUrl);
      
      // Пробуем получить прямую ссылку через API
      const apiUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(originalUrl)}`;
      console.log('YandexDiskImage: API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        console.log('YandexDiskImage: API response:', data);
        if (data.href) {
          console.log('YandexDiskImage: Got direct URL:', data.href);
          setCurrentSrc(data.href);
          return;
        }
      }
      
      // Если API не сработал, используем fallback методы
      console.log('YandexDiskImage: API failed, using fallback');
      const processedUrl = getYandexDiskDirectUrl(originalUrl);
      console.log('YandexDiskImage: Fallback URL:', processedUrl);
      setCurrentSrc(processedUrl);
      
    } catch (error) {
      console.error('YandexDiskImage: Error fetching direct URL:', error);
      // В случае ошибки используем обычную обработку
      const processedUrl = getYandexDiskDirectUrl(originalUrl);
      setCurrentSrc(processedUrl);
    }
  };
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`YandexDiskImage: Ошибка загрузки изображения: ${currentSrc}`);
    console.error('YandexDiskImage: Fallback URLs:', fallbackUrls);
    console.error('YandexDiskImage: Error details:', e.currentTarget.src);
    
    // Пробуем следующий fallback URL
    if (fallbackIndex < fallbackUrls.length - 1) {
      const nextIndex = fallbackIndex + 1;
      console.log(`YandexDiskImage: Trying fallback ${nextIndex}: ${fallbackUrls[nextIndex]}`);
      setFallbackIndex(nextIndex);
      setCurrentSrc(fallbackUrls[nextIndex]);
    } else {
      console.error('YandexDiskImage: All fallbacks failed');
      console.error('YandexDiskImage: Final fallback URLs tried:', fallbackUrls);
      setHasError(true);
      setIsLoading(false);
    }
    
    onError?.(e);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('YandexDiskImage: Image loaded successfully:', currentSrc);
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