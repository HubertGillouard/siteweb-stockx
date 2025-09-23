import React from 'react';
import { Heart } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, variantId: string) => void;
  onProductClick: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart, onProductClick }: ProductCardProps) {
  const primaryImage = product.images?.[0] || { url: '/placeholder.png', alt_text: product.name };
  const minPrice = product.variants?.reduce((min, v) => Math.min(min, v.price), product.base_price) || product.base_price;

  // Choisir la première variante disponible
  const firstAvailableVariant: ProductVariant | undefined = product.variants?.find(v => v.stock > 0);

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={primaryImage.url}
          alt={primaryImage.alt_text || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-100">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
        {product.is_featured && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <p className="text-sm text-gray-500 uppercase tracking-wide">{product.brand?.name}</p>
          <h3
            className="font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-orange-500 transition-colors"
            onClick={() => onProductClick(product.id)}
          >
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">{minPrice.toFixed(2)}€</span>
            {firstAvailableVariant ? (
              <span className="text-xs text-green-600">En stock: {firstAvailableVariant.stock}</span>
            ) : (
              <span className="text-xs text-red-600">Rupture de stock</span>
            )}
          </div>

          <button
            onClick={() => firstAvailableVariant && onAddToCart(product.id, firstAvailableVariant.id)}
            className={`bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors mt-2 ${
              !firstAvailableVariant ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!firstAvailableVariant}
          >
            Ajouter au panier
          </button>
        </div>

        {/* Variantes (taille et couleur) */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Variantes disponibles:</p>
            <div className="flex flex-wrap gap-1">
              {[...new Set(product.variants.map(v => `${v.size} / ${v.color}`))].map((variantKey) => (
                <span key={variantKey} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {variantKey}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
