import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="product-card">
      <img src={product.link || "/placeholder.jpg"} alt={product.name} />
      <div className="product-card-content">
        <h2>{product.name}</h2>
        <p>{product.price}</p>
        <button onClick={() => navigate(`/product/${product.id}`)}>Voir détails</button>
      </div>
    </div>
  );
}
