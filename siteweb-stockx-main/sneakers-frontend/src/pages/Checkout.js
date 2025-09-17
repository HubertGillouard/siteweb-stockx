import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);

  if (!cart.length) return <div>Votre panier est vide</div>;

  return (
    <div className="container">
      <h1>Votre panier</h1>
      <ul>
        {cart.map((item, idx) => (
          <li key={idx}>{item.name} - {item.price}</li>
        ))}
      </ul>
      <button onClick={clearCart}>Vider le panier</button>
    </div>
  );
}
