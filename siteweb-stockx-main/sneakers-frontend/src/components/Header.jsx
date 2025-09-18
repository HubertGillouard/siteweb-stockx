import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

export default function Header() {
  const { cart } = useContext(CartContext);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  };

  return (
    <header style={{ display: "flex", justifyContent: "space-between", padding: "1rem 2rem", backgroundColor: "#222", color: "#fff" }}>
      <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "1.5rem" }}>Sneakers Shop</Link>
      <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link to="/cart" style={{ color: "#fff" }}>Panier ({cart.length})</Link>
        {token ? (
          <button onClick={handleLogout} style={{ cursor: "pointer" }}>Déconnexion</button>
        ) : (
          <Link to="/login" style={{ color: "#fff" }}>Connexion</Link>
        )}
        <Link to="/legal" style={{ color: "#fff" }}>Mentions légales</Link>
      </nav>
    </header>
  );
}
