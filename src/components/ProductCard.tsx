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
  const minPrice = product.variants?.reduce((min, variant) => Math.min(min, variant.price), product.base_price) || product.base_price;

  // On prend la première variante disponible pour l'exemple
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
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
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

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">{minPrice.toFixed(2)}€</span>
            {product.variants && product.variants.length > 1 && (
              <span className="text-xs text-gray-500">{product.variants.length} variantes</span>
            )}
            {firstAvailableVariant ? (
              <span className="text-xs text-green-600">En stock: {firstAvailableVariant.stock}</span>
            ) : (
              <span className="text-xs text-red-600">Rupture de stock</span>
            )}
          </div>

          <button
            onClick={() => firstAvailableVariant && onAddToCart(product.id, firstAvailableVariant.id)}
            className={`bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 ${
              !firstAvailableVariant ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!firstAvailableVariant}
          >
            Ajouter
          </button>
        </div>

        {/* Sizes available */}
        {product.variants && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Tailles disponibles:</p>
            <div className="flex flex-wrap gap-1">
              {[...new Set(product.variants.map(v => v.size))].slice(0, 6).map(size => (
                <span key={size} className="text-xs bg-gray-100 px-2 py-1 rounded">{size}</span>
              ))}
              {[...new Set(product.variants.map(v => v.size))].length > 6 && (
                <span className="text-xs text-gray-500">
                  +{[...new Set(product.variants.map(v => v.size))].length - 6}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
