import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, total } = useCart();
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 transform transition-transform">
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Panier ({items.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!user ? (
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-4">Connectez-vous pour voir votre panier</p>
                <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors">
                  Se connecter
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-600">Votre panier est vide</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {items.map(item => {
                  const variant = item.product_variant;
                  const product = variant?.product;
                  const primaryImage = product?.images?.[0];

                  return (
                    <div key={item.id} className="flex space-x-4 py-4 border-b border-gray-100">
                      {/* Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {primaryImage ? (
                          <img src={primaryImage.url} alt={product?.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 truncate">{product?.name}</h3>
                        <p className="text-xs text-gray-500">
                          {product?.brand?.name} • Taille {variant?.size} • {variant?.color}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">€{variant?.price.toFixed(2)}</p>

                        {/* Quantity controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => {
                                if (item.quantity < (variant?.stock || 0)) updateQuantity(item.id, item.quantity + 1);
                                else alert('Stock insuffisant pour cette variante');
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="p-1 text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {user && items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <button className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-colors">
                Passer la commande
              </button>
              <button 
                onClick={onClose}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                Continuer le shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
