import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

export default function Header() {
  const { cart } = useContext(CartContext);
  return (
    <header>
      <Link to="/">Accueil</Link> | 
      <Link to="/cart">Panier ({cart.length})</Link>
    </header>
  );
}
