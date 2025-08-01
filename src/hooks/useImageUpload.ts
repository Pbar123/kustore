import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UploadOptions {
  maxSize?: number; // в байтах
  allowedTypes?: string[];
  bucket?: string;
  folder?: string;
}

export function useImageUpload(options: UploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    bucket = 'product-images',
    folder = 'products'
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
        throw new Error('Неподдерживаемый тип файла. Разрешены: JPG, PNG, WebP, GIF');
      }

      setProgress(25);

      // Генерируем уникальное имя файла
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      console.log('Uploading to Supabase Storage:', { bucket, filePath, fileSize: file.size });

      setProgress(50);

      // Загружаем в Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);
      setProgress(75);

      // Получаем публичный URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log('Generated public URL:', publicUrl);
      setProgress(100);
      
      return publicUrl;

    } catch (err) {
      console.error('Upload error:', err);
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
      try {
        const url = await uploadImage(files[i]);
        urls.push(url);
        setProgress(((i + 1) / files.length) * 100);
      } catch (error) {
        console.error(`Error uploading file ${i + 1}:`, error);
        // Продолжаем загрузку остальных файлов
      }
    }
    
    return urls;
  };

  const deleteImage = async (url: string): Promise<void> => {
    try {
      // Извлекаем путь из URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${folder}/${fileName}`;

      console.log('Deleting from Supabase Storage:', { bucket, filePath });

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      console.log('File deleted successfully');
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