import React, { useState } from 'react';
import { Tag, Check, X } from 'lucide-react';
import { usePromoCodes } from '../hooks/usePromoCodes';
import { CartItem } from '../types';

interface PromoCodeInputProps {
  cartItems: CartItem[];
  cartTotal: number;
  onPromoApplied: (discount: number, promoCode: string) => void;
  onPromoRemoved: () => void;
  appliedPromoCode?: string;
  discount?: number;
}

export function PromoCodeInput({ 
  cartItems, 
  cartTotal, 
  onPromoApplied, 
  onPromoRemoved,
  appliedPromoCode,
  discount = 0
}: PromoCodeInputProps) {
  const { promoCodes, calculateDiscount } = usePromoCodes();
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyPromo = async () => {
    if (!inputCode.trim()) return;

    setIsApplying(true);
    setError('');

    try {
      const promoCode = promoCodes.find(p => p.code.toLowerCase() === inputCode.toLowerCase());
      
      if (!promoCode) {
        setError('Промокод не найден');
        setIsApplying(false);
        return;
      }

      const result = calculateDiscount(promoCode, cartItems, cartTotal);
      
      if (result.error) {
        setError(result.error);
        setIsApplying(false);
        return;
      }

      onPromoApplied(result.discount, promoCode.code);
      setInputCode('');
      setError('');
    } catch (err) {
      setError('Ошибка при применении промокода');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemovePromo = () => {
    onPromoRemoved();
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyPromo();
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="flex items-center space-x-2 mb-3">
        <Tag className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-900">Промокод</span>
      </div>

      {appliedPromoCode ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">{appliedPromoCode}</span>
            </div>
            <button
              onClick={handleRemovePromo}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Скидка: {discount.toFixed(2)} руб.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Введите промокод"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <button
              onClick={handleApplyPromo}
              disabled={!inputCode.trim() || isApplying}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApplying ? 'Применение...' : 'Применить'}
            </button>
          </div>
          
          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}