import React, { useState, useEffect } from 'react';
import { getYandexDiskDirectUrl, isYandexDiskUrl, createImageFallbacks, getEmbedUrl } from '../utils/yandexDisk';

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
  console.log('YandexDiskImage: Component rendered with src:', src);
  
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [useIframe, setUseIframe] = useState(false);

  // Создаем список fallback URL
  const fallbackUrls = React.useMemo(() => {
    console.log('YandexDiskImage: Creating fallback URLs for:', src);
    if (isYandexDiskUrl(src) && !preserveOriginal) {
      const fallbacks = createImageFallbacks(src);
      console.log('YandexDiskImage: Generated fallbacks:', fallbacks);
      return fallbacks;
    }
    const simpleFallbacks = [src, fallbackSrc];
    console.log('YandexDiskImage: Using simple fallbacks:', simpleFallbacks);
    return simpleFallbacks;
  }, [src, fallbackSrc, preserveOriginal]);

  useEffect(() => {
    console.log('YandexDiskImage: Loading image:', src);
    console.log('YandexDiskImage: Is Yandex Disk URL:', isYandexDiskUrl(src));
    console.log('YandexDiskImage: Preserve original:', preserveOriginal);
    console.log('YandexDiskImage: Fallback URLs:', fallbackUrls);
    
    setIsLoading(true);
    setHasError(false);
    setFallbackIndex(0);
    setUseIframe(false);
    
    // Используем первый URL из fallback списка
    console.log('YandexDiskImage: Using first fallback URL:', fallbackUrls[0]);
    setCurrentSrc(fallbackUrls[0]);
  }, [src, preserveOriginal]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(`YandexDiskImage: Ошибка загрузки изображения: ${currentSrc}`);
    console.log('YandexDiskImage: Failed URL:', e.currentTarget.src);
    
    // Если это была попытка загрузить Яндекс.Диск URL и мы еще не пробовали iframe
    if (isYandexDiskUrl(currentSrc) && !useIframe && currentSrc.includes('/i/')) {
      console.log('YandexDiskImage: Trying iframe approach for Yandex Disk');
      setUseIframe(true);
      setIsLoading(false);
      return;
    }
    
    // Пробуем следующий fallback URL
    if (fallbackIndex < fallbackUrls.length - 1) {
      const nextIndex = fallbackIndex + 1;
      console.log(`YandexDiskImage: Trying fallback ${nextIndex}: ${fallbackUrls[nextIndex]}`);
      setFallbackIndex(nextIndex);
      setCurrentSrc(fallbackUrls[nextIndex]);
      setUseIframe(false);
    } else {
      console.log('YandexDiskImage: All fallbacks failed');
      setHasError(true);
      setIsLoading(false);
    }
    
    onError?.(e);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('YandexDiskImage: Image loaded successfully:', currentSrc);
    const img = e.currentTarget;
    console.log('YandexDiskImage: Image dimensions:', img.naturalWidth, 'x', img.naturalHeight);
    setIsLoading(false);
    setHasError(false);
    setUseIframe(false);
    onLoad?.(e);
  };

  const handleIframeLoad = () => {
    console.log('YandexDiskImage: Iframe loaded successfully');
    setIsLoading(false);
    setHasError(false);
  };

  console.log('YandexDiskImage: Current state:', {
    currentSrc,
    isLoading,
    hasError,
    fallbackIndex,
    useIframe
  });

  // Если все fallback'и не сработали, показываем placeholder с ошибкой
  if (hasError) {
    console.log('YandexDiskImage: Showing error placeholder');
    return (
      <div className={`bg-red-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-2">
          <svg className="w-8 h-8 text-red-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <div className="text-xs text-red-600">Ошибка загрузки</div>
        </div>
      </div>
    );
  }

  // Если нужно использовать iframe для Яндекс.Диска
  if (useIframe && isYandexDiskUrl(src)) {
    console.log('YandexDiskImage: Rendering iframe for Yandex Disk');
    const embedUrl = getEmbedUrl(src);
    return (
      <div className={`relative ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Загрузка через iframe...</div>
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        <iframe
          src={embedUrl}
          className={`w-full h-full border-0 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleIframeLoad}
          title={alt}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    );
  }

  console.log('YandexDiskImage: Rendering img element with src:', currentSrc);
  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Загрузка...</div>
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}