import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ products }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
