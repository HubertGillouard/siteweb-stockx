import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart, subtotal, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  if (!cart.length) return <div>Votre panier est vide</div>;

  return (
    <div className="container">
      <h1>Mon panier</h1>
      <ul>
        {cart.map(item => (
          <li key={item.id} style={{ marginBottom: "1rem" }}>
            <b>{item.name}</b> – {item.price} € × {item.quantity}
            <div>
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeFromCart(item.id)}>❌ Supprimer</button>
            </div>
          </li>
        ))}
      </ul>

      <h2>Total : {subtotal.toFixed(2)} €</h2>
      <button onClick={clearCart}>Vider le panier</button>
      <Link to="/checkout">
        <button>Passer à la caisse</button>
      </Link>
    </div>
  );
}
