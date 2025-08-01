import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { X, Eye, Trash2, Copy, Check } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

interface AdminImageManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function AdminImageManager({ 
  images, 
  onImagesChange, 
  maxImages = 10 
}: AdminImageManagerProps) {
  const { deleteImage } = useImageUpload();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  const handleImageUploaded = (url: string) => {
    const newImages = [...images, url];
    onImagesChange(newImages);
  };

  const handleDeleteImage = async (urlToDelete: string) => {
    if (!confirm('Удалить это изображение?')) return;

    setDeletingUrl(urlToDelete);
    try {
      await deleteImage(urlToDelete);
      const newImages = images.filter(url => url !== urlToDelete);
      onImagesChange(newImages);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Ошибка при удалении изображения');
    } finally {
      setDeletingUrl(null);
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Error copying URL:', error);
    }
  };

  const handlePreviewImage = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <ImageUploader
        onImageUploaded={handleImageUploaded}
        maxImages={maxImages}
        currentImages={images}
      />

      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Загруженные изображения ({images.length}/{maxImages})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((url, index) => (
              <div key={url} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={url}
                      alt={`Изображение ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Изображение {index + 1}
                        {index === 0 && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Основное
                          </span>
                        )}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500 break-all mb-3">
                      {url}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreviewImage(url)}
                        className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Просмотр</span>
                      </button>
                      
                      <button
                        onClick={() => handleCopyUrl(url)}
                        className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800"
                      >
                        {copiedUrl === url ? (
                          <>
                            <Check className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">Скопировано</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Копировать</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteImage(url)}
                        disabled={deletingUrl === url}
                        className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>{deletingUrl === url ? 'Удаление...' : 'Удалить'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}