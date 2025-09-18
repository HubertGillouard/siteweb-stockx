import React, { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

// Ta clé publique Stripe (test)
const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXX");

const CheckoutFormInner = () => {
  const { cart, subtotal, clearCart } = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // 1️⃣ Crée un paiement côté serveur
      const res = await fetch("http://localhost:4000/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: subtotal })
      });
      const paymentData = await res.json();

      if (!res.ok) throw new Error(paymentData.message || "Erreur paiement");

      // 2️⃣ Confirm payment via Stripe (simulé)
      const { error } = await stripe.confirmCardPayment(paymentData.client_secret, {
        payment_method: { card: elements.getElement(CardElement) }
      });

      if (error) throw error;

      clearCart();
      setMessage("✅ Paiement effectué avec succès !");
    } catch (err) {
      console.error(err);
      setMessage(`❌ Erreur : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <p>Total : {subtotal.toFixed(2)} €</p>
      <CardElement options={{ hidePostalCode: true, style: { base: { fontSize: "16px" } } }} />
      <button type="submit" disabled={!stripe || loading} style={{ marginTop: 10 }}>
        {loading ? "Paiement..." : "Payer maintenant"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default function CheckoutForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormInner />
    </Elements>
  );
}
