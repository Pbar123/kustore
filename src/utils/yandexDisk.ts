// Утилиты для работы с Яндекс.Диском

export interface YandexDiskConfig {
  publicKey?: string;
  baseUrl?: string;
}

/**
 * Преобразует публичную ссылку Яндекс.Диска в прямую ссылку на изображение
 * @param publicUrl - публичная ссылка на файл в Яндекс.Диске
 * @returns прямая ссылка на изображение
 */
export function getYandexDiskDirectUrl(publicUrl: string): string {
  try {
    console.log('getYandexDiskDirectUrl: Input URL:', publicUrl);
    
    // Если это уже прямая ссылка, возвращаем как есть
    if (publicUrl.includes('downloader.disk.yandex.ru') || 
        publicUrl.includes('storage.yandexcloud.net')) {
      console.log('getYandexDiskDirectUrl: Already direct URL');
      return publicUrl;
    }

    // Для публичных ссылок пробуем получить через iframe встраивание
    if (publicUrl.includes('disk.yandex.ru/i/') || publicUrl.includes('yadi.sk/i/')) {
      const fileId = publicUrl.includes('disk.yandex.ru/i/') 
        ? publicUrl.split('/i/')[1].split('?')[0]
        : publicUrl.split('/i/')[1].split('?')[0];
      
      // Возвращаем URL для встраивания через iframe
      const embedUrl = `https://yadi.sk/i/${fileId}`;
      console.log('getYandexDiskDirectUrl: Converted to embed URL:', embedUrl);
      return embedUrl;
    }

    // Если формат не распознан, возвращаем исходную ссылку
    console.log('getYandexDiskDirectUrl: Format not recognized, returning original');
    return publicUrl;
  } catch (error) {
    console.error('Ошибка преобразования ссылки Яндекс.Диска:', error);
    return publicUrl;
  }
}

/**
 * Проверяет, является ли URL ссылкой на Яндекс.Диск
 * @param url - URL для проверки
 * @returns true, если это ссылка на Яндекс.Диск
 */
export function isYandexDiskUrl(url: string): boolean {
  return url.includes('disk.yandex.ru') || 
         url.includes('yadi.sk') || 
         url.includes('downloader.disk.yandex.ru') ||
         url.includes('storage.yandexcloud.net');
}

/**
 * Обрабатывает массив URL изображений, преобразуя ссылки Яндекс.Диска
 * @param imageUrls - массив URL изображений
 * @param preserveOriginal - сохранять ли оригинальные URL без обработки
 * @returns массив обработанных URL
 */
export function processImageUrls(imageUrls: string[], preserveOriginal: boolean = false): string[] {
  if (preserveOriginal) {
    return imageUrls; // Возвращаем без обработки для редактирования
  }
  
  return imageUrls.map(url => {
    if (isYandexDiskUrl(url)) {
      return getYandexDiskDirectUrl(url);
    }
    return url;
  });
}

/**
 * Создает резервные URL для изображений с обходом CORS
 * @param originalUrl - оригинальный URL
 * @returns массив URL с резервными вариантами
 */
export function createImageFallbacks(originalUrl: string): string[] {
  console.log('createImageFallbacks: Creating fallbacks for:', originalUrl);
  const fallbacks = [];
  
  if (isYandexDiskUrl(originalUrl)) {
    // Если это прямая ссылка downloader.disk.yandex.ru
    if (originalUrl.includes('downloader.disk.yandex.ru')) {
      console.log('createImageFallbacks: Processing downloader.disk.yandex.ru URL');
      
      // Пробуем разные варианты параметров
      fallbacks.push(
        originalUrl, // Оригинальная ссылка
        originalUrl.replace('preview', 'download'), // Меняем preview на download
        originalUrl.replace('&disposition=inline', '&disposition=attachment'),
        originalUrl.replace('?disposition=inline&', '?').replace('?disposition=inline', ''),
        originalUrl.split('?')[0] // Совсем без параметров
      );
    } 
    // Для ссылок disk.yandex.ru/i/ или yadi.sk/i/
    else if (originalUrl.includes('/i/')) {
      const fileId = originalUrl.split('/i/')[1].split('?')[0];
      console.log('createImageFallbacks: Processing disk.yandex.ru/i/ URL with fileId:', fileId);
      
      // Используем CORS прокси для обхода блокировки
      fallbacks.push(
        // Пробуем через публичные CORS прокси
        `https://cors-anywhere.herokuapp.com/https://disk.yandex.ru/i/${fileId}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://disk.yandex.ru/i/${fileId}`)}`,
        `https://corsproxy.io/?https://disk.yandex.ru/i/${fileId}`,
        
        // Оригинальные ссылки (могут не работать из-за CORS)
        `https://disk.yandex.ru/i/${fileId}`,
        `https://yadi.sk/i/${fileId}`,
        
        // Попытка через iframe встраивание
        `https://yadi.sk/i/${fileId}?iframe=1`
      );
    }
  } else {
    // Для обычных URL
    fallbacks.push(originalUrl);
  }
  
  // Добавляем placeholder в конце
  fallbacks.push('/images/products/placeholder.jpg');
  
  // Убираем дубликаты
  const uniqueFallbacks = [...new Set(fallbacks)];
  console.log('createImageFallbacks: Final fallbacks:', uniqueFallbacks);
  return uniqueFallbacks;
}

/**
 * Получает встраиваемый URL для отображения в iframe
 * @param publicUrl - публичная ссылка на файл
 * @returns URL для встраивания
 */
export function getEmbedUrl(publicUrl: string): string {
  if (publicUrl.includes('/i/')) {
    const fileId = publicUrl.split('/i/')[1].split('?')[0];
    return `https://yadi.sk/i/${fileId}?iframe=1`;
  }
  return publicUrl;
}