import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Sparkles, ArrowRight } from 'lucide-react';

export function CatalogPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Каталог</h1>
        <p className="text-lg text-gray-600">Выберите раздел для просмотра товаров</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Весь ассортимент */}
        <Link 
          to="/all"
          className="group bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="bg-black rounded-full p-4">
              <Store className="h-8 w-8 text-white" />
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Весь ассортимент</h2>
          <p className="text-gray-600 mb-4">
            Полная коллекция нашей одежды с возможностью фильтрации и поиска
          </p>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Все категории</span>
            <span>•</span>
            <span>Фильтры</span>
            <span>•</span>
            <span>Поиск</span>
          </div>
        </Link>

        {/* Новинки */}
        <Link 
          to="/new"
          className="group bg-gradient-to-br from-black to-gray-800 text-white rounded-lg p-8 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <ArrowRight className="h-6 w-6 text-white text-opacity-70 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">Новинки</h2>
          <p className="text-white text-opacity-80 mb-4">
            Последние поступления и самые актуальные модели
          </p>
          
          <div className="flex items-center space-x-2 text-sm text-white text-opacity-60">
            <span>Только новые товары</span>
            <span>•</span>
            <span>Эксклюзивы</span>
          </div>
        </Link>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Удобный поиск</h3>
        <p className="text-gray-600 text-sm">
          Используйте фильтры по размеру, цене и категориям для быстрого поиска нужных товаров. 
          Все товары доступны с подробными описаниями и несколькими фотографиями.
        </p>
      </div>
    </main>
  );
}