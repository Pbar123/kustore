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
    // Если это уже прямая ссылка, возвращаем как есть
    if (publicUrl.includes('downloader.disk.yandex.ru') || 
        publicUrl.includes('storage.yandexcloud.net')) {
      return publicUrl;
    }

    // Если это публичная ссылка вида https://disk.yandex.ru/i/...
    if (publicUrl.includes('disk.yandex.ru/i/')) {
      const fileId = publicUrl.split('/i/')[1];
      return `https://downloader.disk.yandex.ru/preview?url=ya-disk-public%3A%2F%2F${fileId}&name=image&size=800x600`;
    }

    // Если это публичная ссылка вида https://yadi.sk/i/...
    if (publicUrl.includes('yadi.sk/i/')) {
      const fileId = publicUrl.split('/i/')[1];
      return `https://downloader.disk.yandex.ru/preview?url=ya-disk-public%3A%2F%2F${fileId}&name=image&size=800x600`;
    }

    // Если это публичная ссылка с параметрами
    if (publicUrl.includes('disk.yandex.ru') && publicUrl.includes('public_key=')) {
      const urlParams = new URLSearchParams(publicUrl.split('?')[1]);
      const publicKey = urlParams.get('public_key');
      if (publicKey) {
        return `https://downloader.disk.yandex.ru/preview?url=${encodeURIComponent(publicKey)}&name=image&size=800x600`;
      }
    }

    // Если формат не распознан, возвращаем исходную ссылку
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
    const apiUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(publicKey)}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Ошибка API Яндекс.Диска: ${response.status}`);
    }
    
    const data = await response.json();
    return data.href || publicKey;
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
 * @returns массив обработанных URL
 */
export function processImageUrls(imageUrls: string[]): string[] {
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
  const fallbacks = [originalUrl];
  
  if (isYandexDiskUrl(originalUrl)) {
    // Добавляем разные размеры как резервные варианты
    const baseUrl = getYandexDiskDirectUrl(originalUrl);
    fallbacks.push(
      baseUrl.replace('size=800x600', 'size=600x400'),
      baseUrl.replace('size=800x600', 'size=400x300'),
      '/images/products/placeholder.jpg' // Финальный fallback
    );
  } else {
    fallbacks.push('/images/products/placeholder.jpg');
  }
  
  return fallbacks;
}