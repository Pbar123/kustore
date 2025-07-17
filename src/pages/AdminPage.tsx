import React, { useState, useEffect } from 'react';
import { Package, Phone, MapPin, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Order } from '../types';
import { ProtectedRoute } from '../components/ProtectedRoute';

export function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      
      // Обновляем локальное состояние
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
          : order
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      alert('Ошибка при обновлении статуса заказа');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'confirmed': return 'Подтвержден';
      case 'paid': return 'Оплачен';
      case 'shipped': return 'Отправлен';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  const getDeliveryMethodName = (method: string) => {
    switch (method) {
      case 'boxberry': return 'Boxberry';
      case 'russian_post': return 'Почта России';
      case 'cdek': return 'СДЭК';
      default: return method;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Загрузка заказов...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление заказами</h1>
          <p className="text-gray-600">Всего заказов: {orders.length}</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Заказов пока нет</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Заказ #{order.id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(order.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Клиент</h4>
                    <p className="text-sm text-gray-600">{order.customer_name}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {order.customer_phone}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Доставка</h4>
                    <p className="text-sm text-gray-600">{getDeliveryMethodName(order.delivery_method)}</p>
                    <p className="text-sm text-gray-600 flex items-start">
                      <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{order.delivery_address}</span>
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Сумма</h4>
                    <p className="text-lg font-semibold text-gray-900">{order.total_amount} руб.</p>
                    <p className="text-sm text-gray-600">Товаров: {order.items.length}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['confirmed', 'paid', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(order.id, status as Order['status'])}
                      disabled={order.status === status}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        order.status === status
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {getStatusText(status as Order['status'])}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Модальное окно с деталями заказа */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Заказ #{selectedOrder.id.slice(-8)}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Товары */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Товары</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                          <p className="text-sm text-gray-600">
                            Размер: {item.size} • Количество: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{item.total} руб.</p>
                          <p className="text-sm text-gray-600">{item.price} руб./шт.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-3 mt-3">
                    <span>Итого:</span>
                    <span>{selectedOrder.total_amount} руб.</span>
                  </div>
                </div>

                {/* Информация о клиенте */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о клиенте</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Имя</p>
                      <p className="font-medium text-gray-900">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Телефон</p>
                      <p className="font-medium text-gray-900">{selectedOrder.customer_phone}</p>
                    </div>
                    {selectedOrder.customer_email && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{selectedOrder.customer_email}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Доставка */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Доставка</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Способ доставки</p>
                      <p className="font-medium text-gray-900">{getDeliveryMethodName(selectedOrder.delivery_method)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Способ оплаты</p>
                      <p className="font-medium text-gray-900">Банковский перевод</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Адрес доставки</p>
                      <p className="font-medium text-gray-900">{selectedOrder.delivery_address}</p>
                    </div>
                  </div>
                </div>

                {/* Статус */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Управление заказом</h3>
                  <div className="flex flex-wrap gap-2">
                    {['new', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status as Order['status'])}
                        className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                          selectedOrder.status === status
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {getStatusText(status as Order['status'])}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}