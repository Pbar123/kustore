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

    // Если это публичная ссылка вида https://disk.yandex.ru/i/...
    if (publicUrl.includes('disk.yandex.ru/i/')) {
      const fileId = publicUrl.split('/i/')[1];
      // Пробуем несколько вариантов получения изображения
      // Пробуем несколько вариантов получения прямой ссылки
      const directUrl = `https://disk.yandex.ru/i/${fileId}?inline=1`;
      console.log('getYandexDiskDirectUrl: Converted disk.yandex.ru/i/ to:', directUrl);
      return directUrl;
    }

    // Если это публичная ссылка вида https://yadi.sk/i/...
    if (publicUrl.includes('yadi.sk/i/')) {
      const fileId = publicUrl.split('/i/')[1];
      const directUrl = `https://disk.yandex.ru/i/${fileId}?inline=1`;
      console.log('getYandexDiskDirectUrl: Converted yadi.sk/i/ to:', directUrl);
      return directUrl;
    }

    // Если это публичная ссылка с параметрами
    if (publicUrl.includes('disk.yandex.ru') && publicUrl.includes('public_key=')) {
      const urlParams = new URLSearchParams(publicUrl.split('?')[1]);
      const publicKey = urlParams.get('public_key');
      if (publicKey) {
        const directUrl = `${publicKey}?inline=1`;
        console.log('getYandexDiskDirectUrl: Converted public_key URL to:', directUrl);
        return directUrl;
      }
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
 * Получает прямую ссылку на изображение через Яндекс.Диск API
 * @param publicKey - публичный ключ файла
 * @param size - размер изображения (по умолчанию 800x600)
 * @returns Promise с прямой ссылкой на изображение
 */
export async function getYandexDiskImageUrl(publicKey: string, size: string = '800x600'): Promise<string> {
  try {
    // Используем публичный API для получения ссылки на скачивание
    const apiUrl = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(publicKey)}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Ошибка API Яндекс.Диска: ${response.status}`);
    }
    
    const data = await response.json();
    // Возвращаем прямую ссылку на файл
    return data.file || getYandexDiskDirectUrl(publicKey);
  } catch (error) {
    console.error('Ошибка получения ссылки через API:', error);
    // Возвращаем fallback ссылку
    return getYandexDiskDirectUrl(publicKey);
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
 * Создает резервные URL для изображений
 * @param originalUrl - оригинальный URL
 * @returns массив URL с резервными вариантами
 */
export function createImageFallbacks(originalUrl: string): string[] {
  console.log('createImageFallbacks: Creating fallbacks for:', originalUrl);
  const fallbacks = [originalUrl];
  
  if (isYandexDiskUrl(originalUrl)) {
    // Если это уже прямая ссылка downloader.disk.yandex.ru, добавляем альтернативы
    if (originalUrl.includes('downloader.disk.yandex.ru')) {
      console.log('createImageFallbacks: Processing downloader.disk.yandex.ru URL');
      // Пробуем разные параметры для прямой ссылки
      const baseUrl = originalUrl.split('?')[0];
      fallbacks.push(
        originalUrl, // Оригинальная ссылка
        `${baseUrl}?disposition=inline`, // Без лишних параметров
        originalUrl.replace('&disposition=inline', ''), // Убираем disposition
        originalUrl.replace('preview', 'download'), // Меняем preview на download
        baseUrl, // Совсем без параметров
      );
    } else {
      // Для обычных ссылок disk.yandex.ru/i/
      const fileId = originalUrl.includes('/i/') ? originalUrl.split('/i/')[1].split('?')[0] : '';
      
      if (fileId) {
        console.log('createImageFallbacks: Processing disk.yandex.ru/i/ URL with fileId:', fileId);
        fallbacks.push(
          // Разные способы получения изображения
          `https://disk.yandex.ru/i/${fileId}?inline=1`,
          `https://yadi.sk/i/${fileId}`,
          `https://disk.yandex.ru/i/${fileId}`,
          // Попытка через API
          `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(originalUrl)}`,
        );
      }
    }
    
    // Финальный placeholder
    fallbacks.push('/images/products/placeholder.jpg');
  } else {
    console.log('createImageFallbacks: Not a Yandex Disk URL, using simple fallback');
    fallbacks.push('/images/products/placeholder.jpg');
  }
  
  // Убираем дубликаты
  const uniqueFallbacks = [...new Set(fallbacks)];
  console.log('createImageFallbacks: Final fallbacks:', uniqueFallbacks);
  return uniqueFallbacks;
}