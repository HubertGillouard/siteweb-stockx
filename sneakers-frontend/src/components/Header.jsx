// sneakers-frontend/src/components/Header.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Header() {
  const { items } = useCart();
  const { user, role, logout } = useAuth();

  const count = items.reduce((n, it) => n + (it.qty || 1), 0);

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        padding: "8px 10px",
        borderRadius: 8,
        textDecoration: "none",
        color: isActive ? "#111" : "#444",
        background: isActive ? "#ffd54f" : "transparent",
      })}
    >
      {children}
    </NavLink>
  );

  return (
    <header
      style={{
        borderBottom: "1px solid #eee",
        padding: "12px 16px",
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 16, alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 20, color: "#111", textDecoration: "none" }}>
          Sneakers Shop
        </Link>

        <nav style={{ display: "flex", gap: 8, marginLeft: 8 }}>
          <NavItem to="/products">Catalogue</NavItem>
          <NavItem to="/cart">Panier ({count})</NavItem>
          <NavItem to="/legal">Mentions</NavItem>
        </nav>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {user ? (
            <>
              <NavItem to="/profile">Mon compte</NavItem>
              {(role === "admin" || role === "seller") && <NavItem to="/seller">Vendeur</NavItem>}
              {role === "admin" && <NavItem to="/admin">Admin</NavItem>}
              <button
                onClick={logout}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fafafa" }}
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <NavItem to="/login">Se connecter</NavItem>
          )}
        </div>
      </div>
    </header>
  );
}
