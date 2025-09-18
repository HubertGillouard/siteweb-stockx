import React, { useState, useEffect } from "react";

const COOKIE_KEY = "sneakers_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState({ analytics: false, marketing: false, personalization: false });

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_KEY);
    if (!savedConsent) setVisible(true);
    else setConsent(JSON.parse(savedConsent));
  }, []);

  const handleAcceptAll = () => {
    const allConsent = { analytics: true, marketing: true, personalization: true };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(allConsent));
    setConsent(allConsent);
    setVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#111", color: "#fff", padding: "1rem", zIndex: 999 }}>
      <h3>Nous utilisons des cookies 🍪</h3>
      <p>Améliorer l'expérience, analyser le trafic et personnaliser le contenu.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label><input type="checkbox" checked disabled /> Essentiels (nécessaires)</label>
        <label><input type="checkbox" checked={consent.analytics} onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })} /> Analytiques</label>
        <label><input type="checkbox" checked={consent.marketing} onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })} /> Marketing</label>
        <label><input type="checkbox" checked={consent.personalization} onChange={(e) => setConsent({ ...consent, personalization: e.target.checked })} /> Personnalisation</label>
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={handleAcceptAll} style={{ flex: 1 }}>Tout accepter ✅</button>
        <button onClick={handleSavePreferences} style={{ flex: 1 }}>Enregistrer mes choix 💾</button>
      </div>
    </div>
  );
}
