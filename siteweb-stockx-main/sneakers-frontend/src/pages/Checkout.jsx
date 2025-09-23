import React, { useState } from "react";
import { useCart } from "../contexts/CartContext.jsx";
import { checkout, formatPrice } from "../api";

export default function Checkout() {
  const { items, totals, clear } = useCart();
  const [email, setEmail] = useState("");
  const [addr, setAddr] = useState("");
  const [status, setStatus] = useState(null); // success | error | null
  const [order, setOrder] = useState(null);
  const [pending, setPending] = useState(false);

  const doPay = async () => {
    setPending(true);
    setStatus(null);
    try {
      const result = await checkout({ email, address: addr });
      setOrder(result);
      setStatus("success");
      await clear();
    } catch (e) {
      setStatus("error");
    } finally {
      setPending(false);
    }
  };

  if (!items.length && !order) {
    return <div style={s.wrap}>Ton panier est vide.</div>;
  }

  return (
    <div style={s.wrap}>
      <h1>Paiement</h1>

      {order ? (
        <div style={s.card}>
          <h2>Commande confirmée ✅</h2>
          <p>Numéro : <strong>{order.id || order.orderId || "N/A"}</strong></p>
          <p>Un email de confirmation a été simulé.</p>
        </div>
      ) : (
        <>
          <div style={s.card}>
            <h2>Récapitulatif</h2>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {items.map((it) => (
                <li key={`${it.productId}-${it.size || "?"}`} style={{ marginBottom: 6 }}>
                  {it.name} {it.size ? `(Taille ${it.size})` : ""} × {it.qty} – {formatPrice(it.price * it.qty)}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 12, fontWeight: 700 }}>Total : {totals.totalLabel}</div>
          </div>

          <div style={s.card}>
            <h2>Coordonnées</h2>
            <label style={s.label}>Email</label>
            <input style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemple.com" />
            <label style={s.label}>Adresse</label>
            <textarea style={s.textarea} value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="12 rue Exemple, 75000 Paris" />
            <button style={s.btn} disabled={pending || !email || !addr} onClick={doPay}>
              {pending ? "Paiement..." : "Payer (fictif)"}
            </button>
            {status === "error" && <div style={s.err}>Le paiement a échoué. Réessaye.</div>}
          </div>
        </>
      )}
    </div>
  );
}

const s = {
  wrap: { padding: 16, maxWidth: 900, margin: "0 auto" },
  card: { background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 16, marginBottom: 16 },
  label: { display: "block", marginTop: 8, marginBottom: 4, fontWeight: 600 },
  input: { width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd" },
  textarea: { width: "100%", minHeight: 90, padding: 10, borderRadius: 8, border: "1px solid #ddd" },
  btn: { marginTop: 12, padding: "10px 14px", background: "black", color: "white", border: 0, borderRadius: 8, cursor: "pointer" },
  err: { marginTop: 10, color: "#b91c1c" },
};
