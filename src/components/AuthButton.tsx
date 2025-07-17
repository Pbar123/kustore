import React from 'react';
import { User, LogOut, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthButton() {
  const { state, login, logout } = useAuth();

  if (state.isLoading) {
    return (
      <button className="p-2 text-gray-900 cursor-not-allowed" disabled>
        <Loader className="h-5 w-5 animate-spin" />
      </button>
    );
  }

  if (state.isAuthenticated && state.user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="hidden md:block text-sm text-gray-700">
          Привет, {state.user.first_name}!
        </div>
        <button
          onClick={logout}
          className="p-2 text-gray-900 hover:text-gray-600 transition-colors"
          title="Выйти"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="p-2 text-gray-900 hover:text-gray-600 transition-colors"
      title="Войти через Telegram"
    >
      <User className="h-5 w-5" />
    </button>
  );
}