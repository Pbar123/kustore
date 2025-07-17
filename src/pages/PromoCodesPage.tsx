import React from 'react';
import { Tag, Calendar, Percent, Package, Clock } from 'lucide-react';
import { usePromoCodes } from '../hooks/usePromoCodes';
import { PromoCode } from '../types';

export function PromoCodesPage() {
  const { promoCodes, loading, error } = usePromoCodes();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Загрузка промокодов...</div>
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDiscountText = (promo: PromoCode) => {
    if (promo.discount_type === 'percentage') {
      return `${promo.discount_value}%`;
    } else {
      return `${promo.discount_value} руб.`;
    }
  };

  const getCategoryText = (categories: string[]) => {
    if (categories.length === 0) return 'Все товары';
    return categories.join(', ');
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Промокоды</h1>
        <p className="text-lg text-gray-600">Актуальные скидки и специальные предложения</p>
      </div>

      {promoCodes.length === 0 ? (
        <div className="text-center py-12">
          <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Промокоды временно недоступны</p>
          <p className="text-gray-400 text-sm mt-2">Следите за обновлениями</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promoCodes.map((promo) => (
            <div key={promo.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{promo.name}</h3>
                  <p className="text-gray-600 text-sm">{promo.description}</p>
                </div>
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  -{getDiscountText(promo)}
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-4">
                <button
                  onClick={() => copyPromoCode(promo.code)}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-mono text-lg font-bold hover:bg-gray-800 transition-colors"
                >
                  {promo.code}
                </button>
                <p className="text-xs text-gray-500 text-center mt-1">Нажмите, чтобы скопировать</p>
              </div>

              {/* Conditions */}
              <div className="space-y-3 text-sm text-gray-600">
                {promo.min_order_amount > 0 && (
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>От {promo.min_order_amount} руб.</span>
                  </div>
                )}
                
                {promo.min_items_count > 1 && (
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>От {promo.min_items_count} товаров</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4" />
                  <span>{getCategoryText(promo.categories)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>До {formatDate(promo.valid_until)}</span>
                </div>

                {promo.max_uses && (
                  <div className="flex items-center space-x-2">
                    <Percent className="h-4 w-4" />
                    <span>Осталось: {promo.max_uses - promo.current_uses} использований</span>
                  </div>
                )}
              </div>

              {/* Progress bar for limited uses */}
              {promo.max_uses && (
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(promo.current_uses / promo.max_uses) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}