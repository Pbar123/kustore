import React, { useState } from 'react';
import { X, Package, CreditCard, MapPin, Phone, Mail, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { OrderItem } from '../types';
import { supabase } from '../lib/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  appliedPromoCode?: string;
  promoDiscount?: number;
  finalTotal?: number;
}

export function CheckoutModal({ 
  isOpen, 
  onClose, 
  appliedPromoCode = '', 
  promoDiscount = 0,
  finalTotal 
}: CheckoutModalProps) {
  const { state, dispatch } = useCart();
  const { state: authState } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const orderTotal = finalTotal || state.total;
  
  const [formData, setFormData] = useState({
    customer_name: authState.user?.first_name || '',
    customer_phone: '',
    customer_email: '',
    delivery_city: '',
    delivery_postal_code: '',
    delivery_street: '',
    delivery_house: '',
    delivery_apartment: '',
    delivery_method: 'boxberry' as 'boxberry' | 'russian_post' | 'cdek',
    payment_method: 'bank_transfer' as 'bank_transfer'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Имя обязательно для заполнения';
    }
    
    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Телефон обязателен для заполнения';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.customer_phone)) {
      newErrors.customer_phone = 'Введите корректный номер телефона';
    }
    
    if (!formData.delivery_city.trim()) {
      newErrors.delivery_city = 'Город обязателен для заполнения';
    }
    
    if (!formData.delivery_postal_code.trim()) {
      newErrors.delivery_postal_code = 'Индекс обязателен для заполнения';
    } else if (!/^\d{6}$/.test(formData.delivery_postal_code)) {
      newErrors.delivery_postal_code = 'Индекс должен содержать 6 цифр';
    }
    
    if (!formData.delivery_street.trim()) {
      newErrors.delivery_street = 'Улица обязательна для заполнения';
    }
    
    if (!formData.delivery_house.trim()) {
      newErrors.delivery_house = 'Номер дома обязателен для заполнения';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Подготавливаем данные заказа
      const orderItems: OrderItem[] = state.items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image_url,
        size: item.size,
        quantity: item.quantity,
        price: Number(item.product.real_price),
        total: Number(item.product.real_price * item.quantity)
      }));

      // Определяем user_id - может быть null для анонимных заказов
      const userId = authState.user?.telegram_id || null;
      
      console.log('Creating order with user_id:', userId);
      console.log('Auth state:', authState);

      // Создаем заказ в базе данных
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          items: orderItems,
          total_amount: Number(orderTotal),
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_email: formData.customer_email,
          delivery_address: `${formData.delivery_city}, ${formData.delivery_postal_code}, ${formData.delivery_street}, д. ${formData.delivery_house}${formData.delivery_apartment ? `, кв. ${formData.delivery_apartment}` : ''}`,
          delivery_method: formData.delivery_method,
          payment_method: formData.payment_method
        })
        .select()
        .single();

      if (error) {
        console.error('Database error creating order:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('Order created successfully:', order);

      // Отправляем уведомление в Telegram
      try {
        await sendTelegramNotification(order.id, orderItems, formData, orderTotal, appliedPromoCode, promoDiscount);
      } catch (telegramError) {
        console.warn('Не удалось отправить уведомление в Telegram:', telegramError);
        // Не прерываем процесс, если уведомление не отправилось
      }

      // Очищаем корзину
      dispatch({ type: 'CLEAR_CART' });
      
      setIsSuccess(true);
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      
      let errorMessage = 'Произошла ошибка при оформлении заказа.';
      if (error instanceof Error) {
        if (error.message.includes('row-level security')) {
          errorMessage = 'Ошибка доступа к базе данных. Попробуйте еще раз.';
        } else if (error.message.includes('duplicate key')) {
          errorMessage = 'Заказ уже существует.';
        } else if (error.message.includes('foreign key')) {
          errorMessage = 'Ошибка данных. Попробуйте еще раз.';
        } else {
          errorMessage = `Ошибка: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendTelegramNotification = async (
    orderId: string, 
    items: OrderItem[], 
    customerData: typeof formData, 
    total: number,
    promoCode?: string,
    discount?: number
  ) => {
    try {
      // Формируем сообщение для Telegram
      let message = `
🛍️ *НОВЫЙ ЗАКАЗ #${orderId.slice(-8)}*

👤 *Клиент:*
• Имя: ${customerData.customer_name}
• Телефон: ${customerData.customer_phone}
${customerData.customer_email ? `• Email: ${customerData.customer_email}` : ''}

📦 *Товары:*
${items.map(item => `• ${item.product_name} (${item.size}) x${item.quantity} = ${item.total} руб.`).join('\n')}
`;

      if (promoCode && discount && discount > 0) {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        message += `\n💰 *Стоимость:*\n`;
        message += `• Сумма товаров: ${subtotal} руб.\n`;
        message += `• Промокод: ${promoCode} (-${discount} руб.)\n`;
        message += `• К оплате: ${total} руб.\n`;
      } else {
        message += `\n💰 *Итого: ${total} руб.*\n`;
      }

      message += `

🚚 *Доставка:*
• Способ: ${getDeliveryMethodName(customerData.delivery_method)}
• Адрес: ${customerData.delivery_city}, ${customerData.delivery_postal_code}, ${customerData.delivery_street}, д. ${customerData.delivery_house}${customerData.delivery_apartment ? `, кв. ${customerData.delivery_apartment}` : ''}

💳 *Оплата:* Банковский перевод

⏰ ${new Date().toLocaleString('ru-RU')}
      `;

      // Отправляем через Supabase Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-telegram-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          message,
          orderId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('Не удалось отправить уведомление в Telegram:', errorText);
      } else {
        console.log('Уведомление в Telegram отправлено успешно');
      }
    } catch (error) {
      console.error('Ошибка отправки уведомления:', error);
    }
  };

  const getDeliveryMethodName = (method: string) => {
    switch (method) {
      case 'boxberry': return 'Boxberry';
      case 'russian_post': return 'Почта России';
      case 'cdek': return 'СДЭК';
      case 'yandex_market': return 'Яндекс.Маркет';
      default: return method;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Спасибо за заказ!</h2>
            <p className="text-gray-600 mb-4">
              Ваш заказ успешно оформлен. В ближайшее время с вами свяжется представитель магазина для подтверждения деталей и организации доставки.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                <strong>Способ оплаты:</strong> Банковский перевод<br/>
                После подтверждения заказа вам будут высланы реквизиты для оплаты.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Оформление заказа</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Товары в заказе */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ваш заказ</h3>
            <div className="space-y-3 mb-4">
              {state.items.map((item, index) => (
                <div key={`${item.product.id}-${item.size}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">Размер: {item.size} • Количество: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {(item.product.real_price * item.quantity).toFixed(2)} руб.
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-3">
              <span>Итого:</span>
              <div className="text-right">
                {promoDiscount > 0 && (
                  <>
                    <div className="text-sm text-gray-500 line-through font-normal">
                      {state.total.toFixed(2)} руб.
                    </div>
                    <div className="text-xs text-green-600 font-normal">
                      Промокод {appliedPromoCode}: -{promoDiscount.toFixed(2)} руб.
                    </div>
                  </>
                )}
                <span>{orderTotal.toFixed(2)} руб.</span>
              </div>
            </div>
          </div>

          {/* Контактная информация */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Контактная информация
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Полное имя *
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                    errors.customer_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Иван Иванов"
                />
                {errors.customer_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон *
                </label>
                <input
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                    errors.customer_phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+7 (999) 123-45-67"
                />
                {errors.customer_phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (необязательно)
                </label>
                <input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => handleInputChange('customer_email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="ivan@example.com"
                />
              </div>
            </div>
          </div>

          {/* Доставка */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Доставка
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Способ доставки
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'boxberry', label: 'Boxberry', desc: 'Пункты выдачи' },
                  { value: 'russian_post', label: 'Почта России', desc: 'Доставка на дом' },
                  { value: 'cdek', label: 'СДЭК', desc: 'Пункты выдачи' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.delivery_method === method.value
                        ? 'border-black bg-gray-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery_method"
                      value={method.value}
                      checked={formData.delivery_method === method.value}
                      onChange={(e) => handleInputChange('delivery_method', e.target.value)}
                      className="sr-only"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{method.label}</div>
                      <div className="text-sm text-gray-600">{method.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Адрес доставки *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Город *
                  </label>
                  <input
                    type="text"
                    value={formData.delivery_city}
                    onChange={(e) => handleInputChange('delivery_city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                      errors.delivery_city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Москва"
                  />
                  {errors.delivery_city && (
                    <p className="text-red-500 text-sm mt-1">{errors.delivery_city}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Индекс *
                  </label>
                  <input
                    type="text"
                    value={formData.delivery_postal_code}
                    onChange={(e) => handleInputChange('delivery_postal_code', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                      errors.delivery_postal_code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123456"
                  />
                  {errors.delivery_postal_code && (
                    <p className="text-red-500 text-sm mt-1">{errors.delivery_postal_code}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Улица *
                  </label>
                  <input
                    type="text"
                    value={formData.delivery_street}
                    onChange={(e) => handleInputChange('delivery_street', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                      errors.delivery_street ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="ул. Ленина"
                  />
                  {errors.delivery_street && (
                    <p className="text-red-500 text-sm mt-1">{errors.delivery_street}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дом *
                  </label>
                  <input
                    type="text"
                    value={formData.delivery_house}
                    onChange={(e) => handleInputChange('delivery_house', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                      errors.delivery_house ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="15"
                  />
                  {errors.delivery_house && (
                    <p className="text-red-500 text-sm mt-1">{errors.delivery_house}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Квартира/Офис
                  </label>
                  <input
                    type="text"
                    value={formData.delivery_apartment}
                    onChange={(e) => handleInputChange('delivery_apartment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="25"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Оплата */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Способ оплаты
            </h3>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="bank_transfer"
                  name="payment_method"
                  value="bank_transfer"
                  checked={true}
                  readOnly
                  className="mr-3"
                />
                <label htmlFor="bank_transfer" className="font-medium text-gray-900">
                  Банковский перевод
                </label>
              </div>
              <p className="text-sm text-blue-800 mt-2">
                После подтверждения заказа вам будут высланы реквизиты для оплаты. 
                Оплата производится переводом на карту или банковский счет.
              </p>
            </div>
          </div>

          {/* Кнопка отправки */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}