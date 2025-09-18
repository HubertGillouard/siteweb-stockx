// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { createPayment, createOrder } from "../api/api";

export default function ProfilePage({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Ici tu appelleras ton API pour récupérer les commandes de l'utilisateur
    // Exemple : GET /users/:id/orders
    // setOrders(res.data);
  }, []);

  const handleDeleteAccount = () => {
    if (window.confirm("Supprimer définitivement votre compte ?")) {
      // Appel API DELETE /users/:id
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: 20, backgroundColor: "#fff", borderRadius: 10 }}>
      <h1>Mon profil</h1>
      <p><strong>Rôle :</strong> {user.role}</p>

      <h2>Mes commandes</h2>
      {orders.length === 0 ? (
        <p>Vous n'avez pas encore de commandes.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              Commande #{order.id} - {order.total} €
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleDeleteAccount} style={{ marginTop: "1rem", backgroundColor: "#e63600" }}>
        Supprimer mon compte
      </button>
    </div>
  );
}
