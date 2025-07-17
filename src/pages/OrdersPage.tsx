import React, { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, User } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

export function OrdersPage() {
  const { orders, loading, error, getActiveOrders, getCompletedOrders } = useOrders();
  const { state: authState, login } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  if (!authState.isAuthenticated) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Войдите, чтобы видеть заказы</h2>
          <p className="text-gray-600 mb-6">
            Отслеживайте статус ваших заказов и историю покупок
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Мои заказы</h1>
          <p className="text-lg text-gray-600">Загрузка ваших заказов...</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
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
          <div className="text-lg text-red-600">Ошибка загрузки заказов: {error}</div>
        </div>
      </main>
    );
  }

  const activeOrders = getActiveOrders();
  const completedOrders = getCompletedOrders();

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

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
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

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Мои заказы</h1>
          <p className="text-lg text-gray-600">
            Отслеживайте статус ваших заказов и историю покупок
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'active'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Активные ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Завершенные ({completedOrders.length})
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {activeTab === 'active' && activeOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Нет активных заказов</h2>
              <p className="text-gray-600">Ваши новые заказы будут отображаться здесь</p>
            </div>
          )}

          {activeTab === 'completed' && completedOrders.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Нет завершенных заказов</h2>
              <p className="text-gray-600">История ваших покупок будет отображаться здесь</p>
            </div>
          )}

          {(activeTab === 'active' ? activeOrders : completedOrders).map((order) => (
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
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
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
                  <h4 className="font-medium text-gray-900 mb-2">Товары</h4>
                  <p className="text-sm text-gray-600">
                    {order.items.length} {order.items.length === 1 ? 'товар' : 'товара'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Доставка</h4>
                  <p className="text-sm text-gray-600">{getDeliveryMethodName(order.delivery_method)}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Сумма</h4>
                  <p className="text-lg font-semibold text-gray-900">{order.total_amount} руб.</p>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="flex space-x-2 overflow-x-auto">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex-shrink-0 flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <div className="text-xs">
                      <p className="font-medium text-gray-900 truncate max-w-20">{item.product_name}</p>
                      <p className="text-gray-600">{item.size} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg p-2 text-xs text-gray-600">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Order Details Modal */}
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
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">Статус заказа:</span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  <span>{getStatusText(selectedOrder.status)}</span>
                </span>
              </div>

              {/* Items */}
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
                        <p className="text-sm text-gray-600">{item.real_price} руб./шт.</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t pt-3 mt-3">
                  <span>Итого:</span>
                  <span>{selectedOrder.total_amount} руб.</span>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о доставке</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Получатель</p>
                    <p className="font-medium text-gray-900">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Телефон</p>
                    <p className="font-medium text-gray-900">{selectedOrder.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Способ доставки</p>
                    <p className="font-medium text-gray-900">{getDeliveryMethodName(selectedOrder.delivery_method)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Дата заказа</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedOrder.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Адрес доставки</p>
                    <p className="font-medium text-gray-900">{selectedOrder.delivery_address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}