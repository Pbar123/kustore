import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowRight } from 'lucide-react';
import { ProductModal } from '../components/ProductModal';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';

export function HomePage() {
  const { products, loading, error, getNewProducts } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const newProducts = useMemo(() => {
    return getNewProducts().slice(0, 4); // Показываем только первые 4 новинки
  }, [getNewProducts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Ошибка загрузки: {error}</div>
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
            <span className="text-sm font-medium">Бесплатная доставка при заказе от 1200 рублей</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <div 
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/products/placeholder.jpg';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded">
                        NEW
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 font-medium">{product.real_price} руб.</span>
                      <span className="text-sm text-gray-400 line-through">{product.fake_original_price} руб.</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Новинки скоро появятся</p>
            </div>
          )}
        </div>

        {/* Информационный блок */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
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

      <ProductModal
        product={selectedProduct}
        allProducts={products}
        onClose={() => setSelectedProduct(null)}
        onProductClick={setSelectedProduct}
      />
    </>
  );
}