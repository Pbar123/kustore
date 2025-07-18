import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartSidebar } from './CartSidebar';

export function Header() {
  const { state } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    {
      path: '/',
      icon: Home,
      label: 'Главная',
      isActive: isActive('/')
    },
    {
      path: '/catalog',
      icon: Grid3X3,
      label: 'Каталог',
      isActive: isActive('/catalog') || isActive('/all') || isActive('/new')
    },
    {
      path: '/profile',
      icon: User,
      label: 'Кабинет',
      isActive: isActive('/profile') || isActive('/favorites') || isActive('/orders')
    }
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around h-16 px-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
                  item.isActive 
                    ? 'text-black' 
                    : 'text-gray-500'
                }`}
              >
                <IconComponent className={`h-6 w-6 mb-1 ${item.isActive ? 'text-black' : 'text-gray-500'}`} />
                <span className={`text-xs font-medium ${item.isActive ? 'text-black' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Cart Button */}
      {state.itemCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-20 right-4 bg-red-500 text-white rounded-full px-4 py-2 shadow-lg z-40 flex items-center space-x-2 min-w-[120px] justify-center"
        >
          <ShoppingBag className="h-5 w-5" />
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold">{state.total} ₽</span>
            <span className="text-xs opacity-90">{state.itemCount} товар{state.itemCount > 1 ? (state.itemCount < 5 ? 'а' : 'ов') : ''}</span>
          </div>
        </button>
      )}

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}