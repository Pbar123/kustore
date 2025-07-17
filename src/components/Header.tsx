import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Store, Sparkles, ShoppingBag, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartSidebar } from './CartSidebar';

export function Header() {
  const { state } = useCart();
  const { state: authState } = useAuth();
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
      path: '/all',
      icon: Store,
      label: 'Магазин',
      isActive: isActive('/all')
    },
    {
      path: '/new',
      icon: Sparkles,
      label: 'Новинки',
      isActive: isActive('/new')
    },
    {
      path: '/info',
      icon: Info,
      label: 'Инфо',
      isActive: isActive('/info')
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
          
          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-500 transition-colors relative"
          >
            <div className="relative">
              <ShoppingBag className="h-6 w-6 mb-1" />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {state.itemCount > 9 ? '9+' : state.itemCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">Корзина</span>
          </button>
        </div>
      </nav>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}