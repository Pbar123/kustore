/**
 * Утилиты для работы с изображениями из Яндекс.Диска
 */

/**
 * Проверяет, является ли URL ссылкой на Яндекс.Диск
 */
export function isYandexDiskUrl(url: string): boolean {
  return url.includes('disk.yandex.ru') || 
         url.includes('yadi.sk') || 
         url.includes('downloader.disk.yandex.ru') ||
         url.includes('storage.yandexcloud.net');
}

/**
 * Создает список fallback URL для обхода CORS ограничений
 */
export function createImageFallbacks(originalUrl: string): string[] {
  console.log('createImageFallbacks: Creating fallbacks for:', originalUrl);
  const fallbacks = [];
  
  if (isYandexDiskUrl(originalUrl)) {
    // Для прямых ссылок downloader.disk.yandex.ru
    if (originalUrl.includes('downloader.disk.yandex.ru')) {
      console.log('createImageFallbacks: Processing downloader.disk.yandex.ru URL');
      
      // Пробуем разные CORS прокси
      fallbacks.push(
        // Публичные CORS прокси
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(originalUrl)}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(originalUrl)}`,
        `https://thingproxy.freeboard.io/fetch/${originalUrl}`,
        
        // Оригинальная ссылка (может не работать из-за CORS)
        originalUrl,
        
        // Попытка изменить параметры
        originalUrl.replace('preview', 'download'),
        originalUrl.replace('&disposition=inline', '&disposition=attachment'),
        originalUrl.split('?')[0] // Без параметров
      );
    } 
    // Для ссылок disk.yandex.ru/i/ 
    else if (originalUrl.includes('/i/')) {
      const fileId = originalUrl.split('/i/')[1].split('?')[0];
      console.log('createImageFallbacks: Processing disk.yandex.ru/i/ URL with fileId:', fileId);
      
      // Используем CORS прокси для публичных ссылок
      const publicUrl = `https://disk.yandex.ru/i/${fileId}`;
      fallbacks.push(
        // CORS прокси
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(publicUrl)}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(publicUrl)}`,
        `https://thingproxy.freeboard.io/fetch/${publicUrl}`,
        
        // Оригинальные ссылки (могут не работать)
        publicUrl,
        `https://disk.yandex.ru/i/${fileId}?inline=1`
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
 * Обрабатывает массив URL изображений
 */
export function processImageUrls(imageUrls: string[], preserveOriginal: boolean = false): string[] {
  if (preserveOriginal) {
    return imageUrls; // Возвращаем без обработки для редактирования
  }
  
  // Для отображения возвращаем как есть - fallback логика будет в компоненте
  return imageUrls;
}

/**
 * Получает информацию о файле через Яндекс.Диск API (требует CORS прокси)
 */
export async function getYandexDiskFileInfo(publicUrl: string): Promise<string | null> {
  try {
    const apiUrl = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(publicUrl)}&fields=file`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
    
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (data.contents) {
      const fileInfo = JSON.parse(data.contents);
      return fileInfo.file; // Прямая ссылка на файл
    }
  } catch (error) {
    console.error('Ошибка получения информации о файле:', error);
  }
  
  return null;
}