import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductClick: (productId: string) => void;
}

export default function SearchModal({ isOpen, onClose, products, onProductClick }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!products) return; // ⚠️ sécurité
    if (searchTerm.trim()) {
      const filtered = products
        .filter(product => {
          const term = searchTerm.toLowerCase();
          return (
            product.name.toLowerCase().includes(term) ||
            product.brand?.name.toLowerCase().includes(term) ||
            product.description?.toLowerCase().includes(term)
          );
        })
        .slice(0, 8);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchTerm, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher des sneakers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-4">
              {results.map((product) => {
                const primaryImage = product.images?.find(img => img.is_primary);
                return (
                  <button
                    key={product.id}
                    onClick={() => {
                      onProductClick(product.id);
                      onClose();
                    }}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md transition-colors text-left"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {primaryImage && (
                        <img src={primaryImage.image_url} alt={product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.brand?.name}</p>
                      <p className="text-sm font-semibold text-gray-900">€{product.base_price.toFixed(2)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : searchTerm ? (
            <div className="p-8 text-center text-gray-500">Aucun résultat pour "{searchTerm}"</div>
          ) : (
            <div className="p-8 text-center text-gray-500">Tapez pour rechercher des sneakers</div>
          )}
        </div>
      </div>
    </div>
  );
}
