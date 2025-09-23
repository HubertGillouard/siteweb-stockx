// sneakers-frontend/src/pages/Cart.jsx
import React from "react";
import { useCart } from "../contexts/CartContext.jsx";

export default function Cart() {
  const { items, remove, clear, totalItems, totalPrice } = useCart();

  if (!items.length) return <p style={{ padding: 16 }}>Votre panier est vide.</p>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Panier</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((it) => (
          <li key={it.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <div style={{ flex: 1 }}>{it.name}</div>
            <div>x{it.qty}</div>
            <div>{Number(it.price).toFixed(2)} €</div>
            <button onClick={() => remove(it.id)} style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer" }}>Retirer</button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 12, display: "flex", gap: 16, alignItems: "center" }}>
        <strong>Total ({totalItems}): {totalPrice.toFixed(2)} €</strong>
        <button onClick={clear} style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>Vider le panier</button>
      </div>
    </div>
  );
}
