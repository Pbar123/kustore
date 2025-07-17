import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, ArrowRight, Calendar, Package } from 'lucide-react';
import { usePromoCodes } from '../hooks/usePromoCodes';

export function PromoCodeSection() {
  const { promoCodes, loading } = usePromoCodes();

  if (loading) {
    return (
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-sm text-gray-500 uppercase tracking-wide">PROMO</span>
            <h2 className="text-3xl font-bold text-gray-900">ПРОМОКОДЫ</h2>
            <p className="text-gray-600 mt-2">Загрузка актуальных предложений...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const featuredPromoCodes = promoCodes.slice(0, 3);

  if (featuredPromoCodes.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getDiscountText = (promo: any) => {
    if (promo.discount_type === 'percentage') {
      return `${promo.discount_value}%`;
    } else {
      return `${promo.discount_value} ₽`;
    }
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-sm text-gray-500 uppercase tracking-wide">PROMO</span>
          <h2 className="text-3xl font-bold text-gray-900">ПРОМОКОДЫ</h2>
          <p className="text-gray-600 mt-2">Актуальные скидки и специальные предложения</p>
        </div>
        <Link 
          to="/promo"
          className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors group"
        >
          <span className="font-medium">ВСЕ ПРОМОКОДЫ</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredPromoCodes.map((promo) => (
          <div key={promo.id} className="bg-gradient-to-br from-black to-gray-800 text-white rounded-lg p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            
            {/* Discount badge */}
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{getDiscountText(promo)}
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">{promo.name}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{promo.description}</p>
              
              {/* Promo code */}
              <button
                onClick={() => copyPromoCode(promo.code)}
                className="w-full bg-white text-black py-2 px-4 rounded-lg font-mono font-bold text-lg hover:bg-gray-100 transition-colors mb-4"
              >
                {promo.code}
              </button>

              {/* Conditions */}
              <div className="space-y-2 text-xs text-gray-300">
                {promo.min_order_amount > 0 && (
                  <div className="flex items-center space-x-2">
                    <Package className="h-3 w-3" />
                    <span>От {promo.min_order_amount} ₽</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3" />
                  <span>До {formatDate(promo.valid_until)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}