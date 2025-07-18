import React, { useState } from 'react';
import { Heart, Package, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FavoritesPage } from './FavoritesPage';
import { OrdersPage } from './OrdersPage';

export function ProfilePage() {
  const { state: authState, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'favorites' | 'orders' | 'account'>('favorites');

  if (!authState.isAuthenticated) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Войдите в личный кабинет</h2>
          <p className="text-gray-600 mb-6">
            Получите доступ к избранному, заказам и персональным настройкам
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

  const tabs = [
    {
      id: 'favorites' as const,
      label: 'Избранное',
      icon: Heart
    },
    {
      id: 'orders' as const,
      label: 'Заказы',
      icon: Package
    },
    {
      id: 'account' as const,
      label: 'Аккаунт',
      icon: User
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'favorites':
        return <FavoritesPage />;
      case 'orders':
        return <OrdersPage />;
      case 'account':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация об аккаунте</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Имя
                  </label>
                  <p className="text-gray-900">{authState.user?.first_name}</p>
                </div>
                
                {authState.user?.last_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Фамилия
                    </label>
                    <p className="text-gray-900">{authState.user.last_name}</p>
                  </div>
                )}
                
                {authState.user?.username && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <p className="text-gray-900">@{authState.user.username}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID пользователя
                  </label>
                  <p className="text-gray-600 font-mono text-sm">{authState.user?.telegram_id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата регистрации
                  </label>
                  <p className="text-gray-600">
                    {authState.user?.created_at ? new Date(authState.user.created_at).toLocaleDateString('ru-RU') : 'Не указана'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Последний вход
                  </label>
                  <p className="text-gray-600">
                    {authState.user?.last_login ? new Date(authState.user.last_login).toLocaleString('ru-RU') : 'Не указан'}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Выйти из аккаунта</span>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-20">
      {/* Header with tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-gray-900">Личный кабинет</h1>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gray-100 text-black border-b-2 border-black'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="py-6">
        {renderTabContent()}
      </div>
    </div>
  );
}