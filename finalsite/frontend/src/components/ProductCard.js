import React from 'react';

export default function ProductCard({ product }) {
  return (
    <div style={{ border: '1px solid black', margin: 5, padding: 10, width: 200 }}>
      <h3>{product.nom}</h3>
      <p>Prix: ${product.prix}</p>
    </div>
  );
}
