// src/pages/Profile.jsx
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { getProducts } from "../api/api";

export default function Profile({ user }) {
  const { cart } = useContext(CartContext);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  // Simulation récupération wishlist depuis le backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
        // Par défaut, prenons les 3 premiers produits comme wishlist
        setWishlist(res.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((p) => p.id !== id));
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: 20 }}>
      <h1>Profil de {user?.role || "Utilisateur"}</h1>

      <section style={{ marginBottom: 30 }}>
        <h2>Commandes récentes</h2>
        {cart.length === 0 ? (
          <p>Vous n’avez pas encore passé de commandes.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} - {item.price.toFixed(2)} €
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>Ma Wishlist</h2>
        {wishlist.length === 0 ? (
          <p>Votre wishlist est vide.</p>
        ) : (
          <ul>
            {wishlist.map((item) => (
              <li key={item.id} style={{ marginBottom: 10 }}>
                {item.name} - {item.price.toFixed(2)} €
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  style={{ marginLeft: 10 }}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Gestion de vos données</h2>
        <p>
          Pour modifier ou supprimer vos informations personnelles, accédez à la page{" "}
          <a href="/legal">Mes données personnelles</a>.
        </p>
      </section>
    </div>
  );
}
