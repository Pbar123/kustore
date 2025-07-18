import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowRight, AlertCircle } from 'lucide-react';
import { ProductModal } from '../components/ProductModal';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';

export function HomePage() {
  const { products, loading, error, getNewProducts } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const newProducts = useMemo(() => {
    return getNewProducts().slice(0, 4);
  }, [getNewProducts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <div className="text-lg text-gray-600 mb-2">Загрузка KUSTORE...</div>
          <div className="text-sm text-gray-400">Подключение к базе данных</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <div className="text-xl font-bold text-gray-900 mb-2">Ошибка подключения</div>
          <div className="text-sm text-gray-600 mb-4">{error}</div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="text-xs text-yellow-800">
              <p className="font-semibold mb-2">Возможные причины:</p>
              <ul className="text-left space-y-1">
                <li>• Не настроены переменные окружения (.env файл)</li>
                <li>• Неправильный URL или ключ Supabase</li>
                <li>• Проблемы с подключением к интернету</li>
              </ul>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Баннер о бесплатной доставке */}
        <div className="bg-black text-white text-center py-3 mb-8 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <Truck className="h-5 w-5" />
            <span className="text-sm font-medium">Бесплатная доставка от 1200 ₽</span>
          </div>
        </div>

        {/* Приветствие */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Добро пожаловать в KUSTORE</h1>
          <p className="text-lg text-gray-600">Минималистичная одежда для современного стиля</p>
        </div>

        {/* Секция новинок */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-sm text-gray-500 uppercase tracking-wide">NEW</span>
              <h2 className="text-3xl font-bold text-gray-900">НОВИНКИ</h2>
              <p className="text-gray-600 mt-2">Последние поступления в нашем магазине</p>
            </div>
            <Link 
              to="/new"
              className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors group"
            >
              <span className="font-medium">ВСЕ НОВИНКИ</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {newProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newProducts.map((product) => (
                <div 
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/products/placeholder.jpg';
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded">
                        NEW
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 font-medium">{product.real_price} ₽</span>
                      <span className="text-sm text-gray-400 line-through">{product.fake_original_price} ₽</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-500 mb-4">
                {products.length === 0 ? 'Товары загружаются...' : 'Новинки скоро появятся'}
              </div>
              <Link 
                to="/all"
                className="inline-flex items-center space-x-2 text-black hover:text-gray-600 transition-colors"
              >
                <span>Посмотреть все товары</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Информационный блок */}
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">О магазине KUSTORE</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Быстрая доставка</h3>
                <p className="text-sm text-gray-600">Доставка по всей России от 1-3 дней</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Качество</h3>
                <p className="text-sm text-gray-600">Только качественные материалы и проверенные поставщики</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Стиль</h3>
                <p className="text-sm text-gray-600">Минималистичный дизайн для современного образа жизни</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link 
                to="/info"
                className="inline-flex items-center space-x-2 text-black hover:text-gray-600 transition-colors"
              >
                <span>Подробнее о магазине</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          allProducts={products}
          onClose={() => setSelectedProduct(null)}
          onProductClick={setSelectedProduct}
        />
      )}
    </>
  );
}