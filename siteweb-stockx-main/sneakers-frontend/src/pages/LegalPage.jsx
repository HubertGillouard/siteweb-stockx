import React from "react";

export default function LegalPage() {
  return (
    <div className="card">
      <h2>Politique de confidentialité</h2>
      <p>Nous respectons le RGPD. Les données sont utilisées pour le bon fonctionnement du site (panier, commande, authentification). Vous pouvez retirer votre consentement cookies à tout moment depuis ce bandeau lorsque ré-affiché (effacez le localStorage clé <code>consent_v1</code>).</p>
      <ul>
        <li>Cookies fonctionnels (session/consentement).</li>
        <li>Données de commande minimales, paiement simulé.</li>
      </ul>
    </div>
  );
}
