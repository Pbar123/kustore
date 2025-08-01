import React, { useState } from 'react';
import { Upload, Check, X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function StorageTestComponent() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    bucketExists: boolean | null;
    canUpload: boolean | null;
    canRead: boolean | null;
    testImageUrl: string | null;
    errors: string[];
  }>({
    bucketExists: null,
    canUpload: null,
    canRead: null,
    testImageUrl: null,
    errors: []
  });

  const runTests = async () => {
    setTesting(true);
    const newResults = {
      bucketExists: false,
      canUpload: false,
      canRead: false,
      testImageUrl: null,
      errors: [] as string[]
    };

    try {
      // Тест 1: Проверяем существование bucket
      console.log('🧪 Тест 1: Проверка bucket...');
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        newResults.errors.push(`Ошибка получения buckets: ${bucketsError.message}`);
      } else {
        const productImagesBucket = buckets?.find(b => b.name === 'product-images');
        newResults.bucketExists = !!productImagesBucket;
        
        if (!productImagesBucket) {
          newResults.errors.push('Bucket "product-images" не найден');
        } else {
          console.log('✅ Bucket найден:', productImagesBucket);
        }
      }

      // Тест 2: Пробуем загрузить тестовый файл
      if (newResults.bucketExists) {
        console.log('🧪 Тест 2: Загрузка тестового файла...');
        
        // Создаем простое тестовое изображение (1x1 пиксель PNG)
        const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
        const response = await fetch(testImageData);
        const blob = await response.blob();
        const file = new File([blob], 'test.png', { type: 'image/png' });
        
        const fileName = `test-${Date.now()}.png`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(`tests/${fileName}`, file);

        if (uploadError) {
          newResults.errors.push(`Ошибка загрузки: ${uploadError.message}`);
          console.error('❌ Ошибка загрузки:', uploadError);
        } else {
          newResults.canUpload = true;
          console.log('✅ Файл загружен:', uploadData);

          // Тест 3: Проверяем публичный доступ
          console.log('🧪 Тест 3: Проверка публичного доступа...');
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(`tests/${fileName}`);

          newResults.testImageUrl = publicUrl;
          console.log('📎 Публичный URL:', publicUrl);

          // Пробуем загрузить изображение
          try {
            const imageResponse = await fetch(publicUrl);
            if (imageResponse.ok) {
              newResults.canRead = true;
              console.log('✅ Изображение доступно публично');
            } else {
              newResults.errors.push(`Изображение недоступно: ${imageResponse.status}`);
            }
          } catch (fetchError) {
            newResults.errors.push(`Ошибка доступа к изображению: ${fetchError}`);
          }

          // Удаляем тестовый файл
          await supabase.storage
            .from('product-images')
            .remove([`tests/${fileName}`]);
        }
      }

    } catch (error) {
      newResults.errors.push(`Общая ошибка: ${error}`);
      console.error('❌ Общая ошибка тестирования:', error);
    }

    setResults(newResults);
    setTesting(false);
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />;
    return status ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />;
  };

  const getStatusText = (status: boolean | null) => {
    if (status === null) return 'Ожидание...';
    return status ? 'Успешно' : 'Ошибка';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Тестирование Supabase Storage</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3">
          {getStatusIcon(results.bucketExists)}
          <span className="font-medium">Bucket "product-images" существует</span>
          <span className="text-sm text-gray-500">{getStatusText(results.bucketExists)}</span>
        </div>

        <div className="flex items-center space-x-3">
          {getStatusIcon(results.canUpload)}
          <span className="font-medium">Можно загружать файлы</span>
          <span className="text-sm text-gray-500">{getStatusText(results.canUpload)}</span>
        </div>

        <div className="flex items-center space-x-3">
          {getStatusIcon(results.canRead)}
          <span className="font-medium">Публичный доступ к файлам</span>
          <span className="text-sm text-gray-500">{getStatusText(results.canRead)}</span>
        </div>
      </div>

      {results.testImageUrl && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 mb-2">Тестовое изображение:</p>
          <a 
            href={results.testImageUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 break-all"
          >
            {results.testImageUrl}
          </a>
        </div>
      )}

      {results.errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="font-medium text-red-800">Ошибки:</span>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {results.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={runTests}
        disabled={testing}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload className="w-4 h-4" />
        <span>{testing ? 'Тестирование...' : 'Запустить тесты'}</span>
      </button>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Что проверяется:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>1. Существование bucket "product-images"</li>
          <li>2. Возможность загрузки файлов</li>
          <li>3. Публичный доступ к загруженным файлам</li>
        </ul>
      </div>
    </div>
  );
}