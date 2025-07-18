import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { TelegramWebAppInit } from './components/TelegramWebAppInit';
import { HomePage } from './pages/HomePage';
import { NewPage } from './pages/NewPage';
import { InfoPage } from './pages/InfoPage';
import { AllProductsPage } from './pages/AllProductsPage';
import { CatalogPage } from './pages/CatalogPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <TelegramWebAppInit />
          <div className="min-h-screen bg-white pb-16">
            <Header />
            
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/info" element={<InfoPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/new" element={<NewPage />} />
              <Route path="/all" element={<AllProductsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;