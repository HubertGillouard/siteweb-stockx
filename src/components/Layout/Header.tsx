import React, { useState } from 'react';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';

import AuthModal from '../AuthModal';
import SearchModal from '../SearchModal';
import CartSidebar from '../CartSidebar';
import { useProducts } from '../../hooks/useProducts';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { user, signOut, isAdmin, isVendor } = useAuth();
  const { items } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <h1 className="text-2xl font-bold text-black">Sneakiz</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => navigate('/new-release')} className="text-gray-900 hover:text-orange-500 transition-colors">New Releases</button>
              <button onClick={() => navigate('/shop')} className="text-gray-900 hover:text-orange-500 transition-colors">Men</button>
              <button onClick={() => navigate('/shop')} className="text-gray-900 hover:text-orange-500 transition-colors">Women</button>
              <button onClick={() => navigate('/shop')} className="text-gray-900 hover:text-orange-500 transition-colors">Kids</button>
              <button onClick={() => navigate('/shop')} className="text-gray-900 hover:text-orange-500 transition-colors">Brands</button>
              {isAdmin && <button onClick={() => navigate('/admin')} className="text-orange-500 hover:text-orange-600 transition-colors font-medium">Admin</button>}
              {isVendor && <button onClick={() => navigate('/vendor-dashboard')} className="text-blue-500 hover:text-blue-600 transition-colors font-medium">Vendeur</button>}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Recherche */}
              <button onClick={() => setShowSearchModal(true)} className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Panier */}
              <button onClick={() => setShowCartSidebar(true)} className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Auth / User */}
              {user ? (
                <div className="relative">
                  <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:block">{user.email}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <button onClick={() => { navigate('/profile'); setShowUserMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mon Profil</button>
                      <button onClick={() => { navigate('/orders'); setShowUserMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mes Commandes</button>
                      <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Déconnexion</button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">Se connecter</button>
              )}

              {/* Menu Mobile */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-gray-900">
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Navigation Mobile */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-2">
                <button onClick={() => { navigate('/new-release'); setIsMenuOpen(false); }} className="text-gray-900 hover:text-orange-500 py-2 transition-colors">New Releases</button>
                <button onClick={() => { navigate('/shop'); setIsMenuOpen(false); }} className="text-gray-900 hover:text-orange-500 py-2 transition-colors">Men</button>
                <button onClick={() => { navigate('/shop'); setIsMenuOpen(false); }} className="text-gray-900 hover:text-orange-500 py-2 transition-colors">Women</button>
                <button onClick={() => { navigate('/shop'); setIsMenuOpen(false); }} className="text-gray-900 hover:text-orange-500 py-2 transition-colors">Kids</button>
                <button onClick={() => { navigate('/shop'); setIsMenuOpen(false); }} className="text-gray-900 hover:text-orange-500 py-2 transition-colors">Brands</button>
                {isAdmin && <button onClick={() => { navigate('/admin'); setIsMenuOpen(false); }} className="text-orange-500 hover:text-orange-600 py-2 transition-colors font-medium">Admin</button>}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modals et Sidebars */}
      {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
      {showSearchModal && <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} products={products || []} onProductClick={(id) => { navigate(`/shop/${id}`); setShowSearchModal(false); }} />}
      {showCartSidebar && <CartSidebar isOpen={showCartSidebar} onClose={() => setShowCartSidebar(false)} />}
    </>
  );
}
