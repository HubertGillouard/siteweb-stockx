import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  images?: { url: string }[];
  // ajoute d'autres champs si nécessaire
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (productId: string) => void;
}

export default function ProductGrid({ products, onAddToCart, onProductClick }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
}
