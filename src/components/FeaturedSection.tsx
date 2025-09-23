import React from 'react';
import  ProductGrid  from './ProductGrid';
import { Product } from '../types';

interface FeaturedSectionProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (productId: string) => void;
  onProductClick: (productId: string) => void;
}

export function FeaturedSection({ products, loading, onAddToCart, onProductClick }: FeaturedSectionProps) {
  const featuredProducts = products.filter(p => p.is_featured).slice(0, 8);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Coups de Cœur
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de sneakers incontournables, choisies par nos experts
          </p>
        </div>

        <ProductGrid
          products={featuredProducts}
          loading={loading}
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
        />

        <div className="text-center mt-12">
          <button className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors">
            Voir toute la collection
          </button>
        </div>
      </div>
    </section>
  );
}