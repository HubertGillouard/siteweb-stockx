import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", textAlign: "center", backgroundColor: "#fff" }}>
      <Link to={`/product/${product.id}`}>
        <img src={product.link || "/placeholder.jpg"} alt={product.name} style={{ width: "100%", borderRadius: "8px" }} />
      </Link>
      <h3>{product.name}</h3>
      <p style={{ fontWeight: "bold" }}>{Number(product.price).toFixed(2)} €</p>
      <button onClick={() => addToCart(product)}>Ajouter au panier</button>
    </div>
  );
}
