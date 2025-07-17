import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PromoCode, CartItem } from '../types';

export function usePromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .lte('valid_from', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPromoCodes(data || []);
    } catch (err) {
      console.error('Error fetching promo codes:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getActivePromoCodes = () => {
    return promoCodes.filter(promo => 
      promo.is_active && 
      new Date(promo.valid_until) > new Date() &&
      new Date(promo.valid_from) <= new Date() &&
      (promo.max_uses === null || promo.current_uses < promo.max_uses)
    );
  };

  const checkPromoCodeApplicability = (promoCode: PromoCode, cartItems: CartItem[], cartTotal: number) => {
    // Check minimum order amount
    if (cartTotal < promoCode.min_order_amount) {
      return {
        applicable: false,
        reason: `Минимальная сумма заказа: ${promoCode.min_order_amount} руб.`
      };
    }

    // Check minimum items count
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems < promoCode.min_items_count) {
      return {
        applicable: false,
        reason: `Минимальное количество товаров: ${promoCode.min_items_count} шт.`
      };
    }

    // Check categories (empty array means all categories)
    if (promoCode.categories.length > 0) {
      const hasMatchingCategory = cartItems.some(item => 
        promoCode.categories.includes(item.product.category)
      );
      if (!hasMatchingCategory) {
        return {
          applicable: false,
          reason: `Промокод действует только на: ${promoCode.categories.join(', ')}`
        };
      }
    }

    // Check usage limit
    if (promoCode.max_uses !== null && promoCode.current_uses >= promoCode.max_uses) {
      return {
        applicable: false,
        reason: 'Промокод исчерпан'
      };
    }

    return { applicable: true };
  };

  const calculateDiscount = (promoCode: PromoCode, cartItems: CartItem[], cartTotal: number) => {
    const applicabilityCheck = checkPromoCodeApplicability(promoCode, cartItems, cartTotal);
    if (!applicabilityCheck.applicable) {
      return { discount: 0, newTotal: cartTotal, error: applicabilityCheck.reason };
    }

    let discount = 0;
    
    if (promoCode.discount_type === 'percentage') {
      // For category-specific promo codes, apply discount only to matching items
      if (promoCode.categories.length > 0) {
        const categoryTotal = cartItems
          .filter(item => promoCode.categories.includes(item.product.category))
          .reduce((sum, item) => sum + (item.product.real_price * item.quantity), 0);
        discount = (categoryTotal * promoCode.discount_value) / 100;
      } else {
        discount = (cartTotal * promoCode.discount_value) / 100;
      }
    } else {
      discount = promoCode.discount_value;
    }

    // Don't let discount exceed cart total
    discount = Math.min(discount, cartTotal);
    
    const newTotal = Math.max(0, cartTotal - discount);
    
    return { discount, newTotal };
  };

  const getApplicablePromoCodes = (cartItems: CartItem[], cartTotal: number) => {
    return promoCodes.filter(promo => {
      const check = checkPromoCodeApplicability(promo, cartItems, cartTotal);
      return check.applicable;
    });
  };

  return {
    promoCodes,
    loading,
    error,
    getActivePromoCodes,
    checkPromoCodeApplicability,
    calculateDiscount,
    getApplicablePromoCodes,
    refetch: fetchPromoCodes
  };
}