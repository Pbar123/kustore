import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  maxImages?: number;
  currentImages?: string[];
}

export function ImageUploader({ 
  onImageUploaded, 
  maxImages = 10, 
  currentImages = [] 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // Нужно настроить
    formData.append('cloud_name', 'your_cloud_name'); // Нужно настроить

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
    
    return data.secure_url;
  };

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY`, // Нужно настроить
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    if (!data.success) throw new Error(data.error?.message || 'Upload failed');
    
    return data.data.url;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

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
        
        // Проверяем размер файла (макс 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`Файл ${file.name} слишком большой (макс 5MB)`);
        }

        // Проверяем тип файла
        if (!file.type.startsWith('image/')) {
          throw new Error(`Файл ${file.name} не является изображением`);
        }

        setUploadProgress((i / files.length) * 100);

        // Пробуем загрузить в Supabase (основной вариант)
        let imageUrl: string;
        try {
          imageUrl = await uploadToSupabase(file);
        } catch (supabaseError) {
          console.warn('Supabase upload failed, trying ImgBB:', supabaseError);
          // Fallback на ImgBB
          imageUrl = await uploadToImgBB(file);
        }

        onImageUploaded(imageUrl);
      }

      setUploadProgress(100);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
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
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                Нажмите для загрузки изображений
              </span>
              <span className="text-xs text-gray-500">
                PNG, JPG, WebP до 5MB ({currentImages.length}/{maxImages})
              </span>
            </>
          )}
        </label>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}