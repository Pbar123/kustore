import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';
import { ProductGrid } from '../components/ProductGrid';
import { ProductModal } from '../components/ProductModal';
import { CartSidebar } from '../components/CartSidebar';
import { Product } from '../types';

export function FavoritesPage() {
  const { favorites, loading, error } = useFavorites();
  const { state: authState, login } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (!authState.isAuthenticated) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Войдите, чтобы видеть избранное</h2>
          <p className="text-gray-600 mb-6">
            Сохраняйте понравившиеся товары и не теряйте их
          </p>
          <button
            onClick={login}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Войти через Telegram
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Избранное</h1>
          <p className="text-lg text-gray-600">Загрузка ваших любимых товаров...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-lg text-red-600">Ошибка загрузки избранного: {error}</div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Избранное</h1>
          <p className="text-lg text-gray-600">
            {favorites.length > 0 
              ? `Ваши любимые товары (${favorites.length})`
              : 'Здесь будут ваши любимые товары'
            }
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Избранное пусто</h2>
            <p className="text-gray-600 mb-6">
              Добавляйте товары в избранное, нажимая на иконку сердечка
            </p>
            <button
              onClick={() => window.location.href = '/all'}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Перейти в магазин</span>
            </button>
          </div>
        ) : (
          <ProductGrid
            products={favorites}
            onProductClick={setSelectedProduct}
          />
        )}
      </main>

      <ProductModal
        product={selectedProduct}
        allProducts={favorites}
        onClose={() => setSelectedProduct(null)}
        onProductClick={setSelectedProduct}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}