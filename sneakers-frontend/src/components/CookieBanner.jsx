import React, { useEffect, useState } from "react";
import { getConsent, setConsent } from "../api";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const c = await getConsent();
      setVisible(!c); // affiche si pas encore consenti
    })();
  }, []);

  if (!visible) return null;

  const acceptAll = async () => {
    await setConsent("all");
    setVisible(false);
  };

  const refuseAll = async () => {
    await setConsent("none");
    setVisible(false);
  };

  return (
    <div style={s.wrap} role="dialog" aria-live="polite">
      <div style={s.text}>
        Nous utilisons des cookies pour améliorer votre expérience.{" "}
        <a href="/legal" style={{ color: "#cce" }}>En savoir plus</a>
      </div>
      <div style={s.actions}>
        <button onClick={refuseAll} style={s.secondary}>Tout refuser</button>
        <button onClick={acceptAll} style={s.primary}>Tout accepter</button>
      </div>
    </div>
  );
}

const s = {
  wrap: {
    position: "fixed", left: 12, right: 12, bottom: 12, zIndex: 10000,
    background: "#111", color: "#fff", padding: 12, borderRadius: 12,
    display: "flex", gap: 12, alignItems: "center", boxShadow: "0 8px 30px rgba(0,0,0,.35)"
  },
  text: { flex: 1, lineHeight: 1.35 },
  actions: { display: "flex", gap: 8 },
  primary: { background: "#06f", color: "#fff", border: 0, borderRadius: 8, padding: "8px 12px", cursor: "pointer" },
  secondary: { background: "#333", color: "#fff", border: 0, borderRadius: 8, padding: "8px 12px", cursor: "pointer" },
};
