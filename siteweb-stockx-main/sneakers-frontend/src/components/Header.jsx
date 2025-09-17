import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <header style={{ padding: 10, display: "flex", justifyContent: "space-between" }}>
      <div>
        <Link to="/" style={{ marginRight: 10 }}>Accueil</Link>
        {role === "admin" && <Link to="/admin">Dashboard Admin</Link>}
      </div>
      <div>
        {role ? (
          <button onClick={handleLogout}>Déconnexion</button>
        ) : (
          <Link to="/login">Connexion</Link>
        )}
      </div>
    </header>
  );
}
