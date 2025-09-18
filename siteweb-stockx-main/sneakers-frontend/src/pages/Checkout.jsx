// src/pages/Checkout.jsx
import React, { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { createPayment, createOrder } from "../api/api"; // ✅ chemin corrigé

export default function Checkout() {
  const { cart, subtotal, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!cart.length) return <div>Votre panier est vide</div>;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // 1️⃣ Paiement fictif
      const payment = await createPayment({ amount: subtotal });

      // 2️⃣ Création commande
      const order = await createOrder({
        userId: 1, // ⚠️ remplacer par l’utilisateur connecté
        items: cart,
        total: subtotal,
        payment
      });

      alert("Commande validée ✅\nNuméro: " + order.id);
      clearCart();
      navigate("/");
    } catch (e) {
      console.error(e);
      alert("Erreur pendant le paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Finaliser la commande</h1>
      <p>Total à payer : {subtotal.toFixed(2)} €</p>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Paiement en cours..." : "Payer (fictif)"}
      </button>
    </div>
  );
}
