import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UploadOptions {
  maxSize?: number; // в байтах
  allowedTypes?: string[];
  bucket?: string;
}

export function useImageUpload(options: UploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    bucket = 'product-images'
  } = options;

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Валидация файла
      if (file.size > maxSize) {
        throw new Error(`Файл слишком большой. Максимум ${Math.round(maxSize / 1024 / 1024)}MB`);
      }

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Неподдерживаемый тип файла');
      }

      // Генерируем уникальное имя файла
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      setProgress(25);

      // Загружаем в Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      setProgress(75);

      // Получаем публичный URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setProgress(100);
      return publicUrl;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const uploadMultiple = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i]);
      urls.push(url);
      setProgress(((i + 1) / files.length) * 100);
    }
    
    return urls;
  };

  const deleteImage = async (url: string): Promise<void> => {
    try {
      // Извлекаем путь из URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting image:', err);
      throw err;
    }
  };

  return {
    uploadImage,
    uploadMultiple,
    deleteImage,
    uploading,
    progress,
    error,
    clearError: () => setError(null)
  };
}