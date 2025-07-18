import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { TelegramWebAppInit } from './components/TelegramWebAppInit';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { AllProductsPage } from './pages/AllProductsPage';
import { NewPage } from './pages/NewPage';
import { ProfilePage } from './pages/ProfilePage';
import { InfoPage } from './pages/InfoPage';
import { PromoCodesPage } from './pages/PromoCodesPage';

function App() {
  React.useEffect(() => {
    console.log('🚀 KUSTORE App загружен!');
    console.log('📊 Проверка переменных окружения:');
    console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Установлен' : '❌ Отсутствует');
    console.log('SUPABASE_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Установлен' : '❌ Отсутствует');
    
    if (import.meta.env.VITE_SUPABASE_URL) {
      console.log('🔗 URL:', import.meta.env.VITE_SUPABASE_URL.substring(0, 30) + '...');
    }
    if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('🔑 KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20) + '...');
    }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <TelegramWebAppInit />
            
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/all" element={<AllProductsPage />} />
              <Route path="/new" element={<NewPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/favorites" element={<ProfilePage />} />
              <Route path="/orders" element={<ProfilePage />} />
              <Route path="/info" element={<InfoPage />} />
              <Route path="/promo" element={<PromoCodesPage />} />
            </Routes>
            
            <Header />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;