import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  maxImages?: number;
  currentImages?: string[];
  className?: string;
}

export function ImageUploader({ 
  onImageUploaded, 
  maxImages = 10, 
  currentImages = [],
  className = ''
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    console.log('Uploading to Supabase Storage:', filePath);

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    console.log('Upload successful:', data);

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    console.log('Public URL:', publicUrl);
    return publicUrl;
  };

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    if (currentImages.length + files.length > maxImages) {
      setError(`Максимум ${maxImages} изображений`);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Проверяем размер файла (макс 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`Файл ${file.name} слишком большой (макс 10MB)`);
        }

        // Проверяем тип файла
        if (!file.type.startsWith('image/')) {
          throw new Error(`Файл ${file.name} не является изображением`);
        }

        setUploadProgress(((i + 1) / files.length) * 100);

        const imageUrl = await uploadToSupabase(file);
        onImageUploaded(imageUrl);
      }

      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : uploading || currentImages.length >= maxImages
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          disabled={uploading || currentImages.length >= maxImages}
          className="hidden"
          id="image-upload"
        />
        
        <label
          htmlFor="image-upload"
          className={`cursor-pointer flex flex-col items-center space-y-2 ${
            uploading || currentImages.length >= maxImages 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">
                Загрузка... {Math.round(uploadProgress)}%
              </span>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <span className="text-sm text-gray-600">
                {dragOver 
                  ? 'Отпустите файлы для загрузки'
                  : 'Перетащите изображения или нажмите для выбора'
                }
              </span>
              <span className="text-xs text-gray-500">
                PNG, JPG, WebP до 10MB ({currentImages.length}/{maxImages})
              </span>
            </>
          )}
        </label>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {uploading && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 text-center">
            Загружено {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      {currentImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {currentImages.slice(0, 6).map((url, index) => (
            <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={url}
                alt={`Изображение ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {currentImages.length > 6 && (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-sm text-gray-500">+{currentImages.length - 6}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}