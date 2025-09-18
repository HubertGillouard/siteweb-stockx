import React, { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { createOrder, createPayment } from "../api/api";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const orderRes = await createOrder({ items: cart });
      const paymentRes = await createPayment({ orderId: orderRes.data.id, amount: totalPrice() });
      setSuccess(true);
      clearCart();
      console.log("Paiement réussi :", paymentRes.data);
    } catch (err) {
      alert("Erreur lors du paiement");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) return <div className="container"><h2>✅ Commande passée avec succès !</h2></div>;

  return (
    <div className="container">
      <h1>Paiement</h1>
      {cart.map(p => (
        <div key={p.id}>{p.name} - {p.price.toFixed(2)} €</div>
      ))}
      <h2>Total : {totalPrice().toFixed(2)} €</h2>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Traitement..." : "Payer maintenant"}
      </button>
    </div>
  );
}
