import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { cart } = useContext(CartContext);

  return (
    <header>
      <div>Accueil</div>
      <div>
        <Link to="/">Nos Sneakers</Link>
        <Link to="/checkout">Panier ({cart.length})</Link>
      </div>
    </header>
  );
}
