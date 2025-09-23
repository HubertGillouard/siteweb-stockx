import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="card">
      <h2>Bienvenue 👟</h2>
      <p>Parcourez nos modèles et profitez d’un parcours d’achat complet (panier → paiement fictif) avec gestion des rôles et du stock.</p>
      <div className="row" style={{gap:10}}>
        <Link className="btn" to="/catalog">Voir le catalogue</Link>
        <Link className="btn secondary" to="/legal">RGPD & Confidentialité</Link>
      </div>
    </div>
  );
}
