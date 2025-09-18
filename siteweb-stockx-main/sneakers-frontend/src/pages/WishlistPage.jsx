// src/pages/WishlistPage.jsx
import React, { useState, useEffect } from "react";
import { getProducts } from "../api/api";

export default function WishlistPage({ user }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Ici tu peux récupérer les favoris depuis l'API ou le localStorage
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "2rem auto", padding: 20 }}>
      <h1>Ma Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Votre wishlist est vide.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {wishlist.map((product) => (
            <div key={product.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 10 }}>
              <img src={product.link} alt={product.name} style={{ width: "100%", borderRadius: 8 }} />
              <h3>{product.name}</h3>
              <p>{product.price.toFixed(2)} €</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
