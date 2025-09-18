import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart, totalPrice, clearCart } = useContext(CartContext);

  if (cart.length === 0) return <div className="container"><h2>Panier vide</h2></div>;

  return (
    <div className="container">
      <h1>Mon Panier</h1>
      {cart.map(p => (
        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>{p.name} - {p.price.toFixed(2)} €</div>
          <button onClick={() => removeFromCart(p.id)}>Supprimer</button>
        </div>
      ))}
      <h2>Total : {totalPrice().toFixed(2)} €</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={clearCart}>Vider le panier</button>
        <Link to="/checkout"><button>Passer commande</button></Link>
      </div>
    </div>
  );
}
