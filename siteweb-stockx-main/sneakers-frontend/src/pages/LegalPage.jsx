import React, { useState } from "react";

export default function LegalPage() {
  const [dpoMessage, setDpoMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleDpoSubmit = (e) => {
    e.preventDefault();
    console.log("Message DPO :", dpoMessage);
    setSubmitted(true);
    setDpoMessage("");
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: 20, backgroundColor: "#fff", borderRadius: 10 }}>
      <h1>Mentions Légales & Politique de Confidentialité</h1>

      <section style={{ marginBottom: 30 }}>
        <h2>Mentions légales</h2>
        <p><strong>Nom du site :</strong> Sneakers Shop</p>
        <p><strong>Responsable :</strong> Hubert GILLOUARD</p>
        <p><strong>SIRET :</strong> 123 456 789 00000</p>
        <p><strong>Adresse :</strong> 10 Rue Exemple, 75000 Paris, France</p>
        <p><strong>Hébergeur :</strong> OVH, 2 rue Kellermann, 59100 Roubaix</p>
        <p><strong>Contact DPO :</strong> dpo@sneakers-shop.com</p>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>Politique de confidentialité</h2>
        <p>Nous collectons uniquement les données nécessaires pour le fonctionnement de notre site et la gestion des commandes.</p>
        <ul>
          <li>Consentement explicite pour données non essentielles</li>
          <li>Minimisation des données</li>
          <li>Conservation limitée (13 mois pour cookies)</li>
          <li>Droits des utilisateurs : accès, modification, suppression, portabilité, opposition</li>
        </ul>
      </section>

      <section>
        <h2>Formulaire contact DPO</h2>
        {submitted ? (
          <p style={{ color: "green" }}>✅ Votre message a été envoyé au DPO.</p>
        ) : (
          <form onSubmit={handleDpoSubmit}>
            <textarea
              value={dpoMessage}
              onChange={(e) => setDpoMessage(e.target.value)}
              placeholder="Votre demande (accès, modification, suppression, opposition...)"
              rows={5}
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
              required
            />
            <button type="submit">Envoyer au DPO</button>
          </form>
        )}
      </section>
    </div>
  );
}
