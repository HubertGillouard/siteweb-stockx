// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './components/CartProvider';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Hero from './components/Hero';
import AuthModal from './components/AuthModal';
import CartSidebar from './components/CartSidebar';
import SearchModal from './components/SearchModal';
import CookieConsentBanner from './components/RGPD/CookieConsentBanner';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import NewReleasePage from './pages/NewReleasePage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import VendorDashboard from './pages/vendor/VendorDashboard';
import PrivacyPolicyPage from './components/RGPD/PrivacyPolicyPage';

import { AuthContext, useAuthProvider, useAuth } from './hooks/useAuth';
import { useProducts } from './hooks/useProducts';

export default function App() {
  const authValue = useAuthProvider();

  return (
    <AuthContext.Provider value={authValue}>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthContext.Provider>
  );
}

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);

  const { products } = useProducts();
  const { user, profile, loading } = useAuth();

  const handleCookieConsent = (consents: any) => {
    console.log('Consentements cookie:', consents);
    setShowCookieConsent(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAuthClick={() => setIsAuthModalOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      <main>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:productId" element={<ShopPage />} /> {/* détail produit */}
          <Route path="/new-release" element={<NewReleasePage />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/orders" element={user ? <OrdersPage /> : <Navigate to="/" />} />
          <Route path="/checkout" element={user ? <CheckoutPage /> : <Navigate to="/" />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/admin" element={profile?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/admin-products" element={profile?.role === 'admin' ? <ProductManagement /> : <Navigate to="/" />} />
          <Route path="/vendor-dashboard" element={profile?.role === 'vendor' || profile?.role === 'admin' ? <VendorDashboard /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />

      {/* Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products || []}
        onProductClick={(id: string) => console.log('Produit cliqué:', id)}
      />

      {/* Cookie banner */}
      {showCookieConsent && (
        <CookieConsentBanner
          onAcceptAll={handleCookieConsent}
          onRejectAll={handleCookieConsent}
          onCustomize={handleCookieConsent}
        />
      )}
    </div>
  );
}
