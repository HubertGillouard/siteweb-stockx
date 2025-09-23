import React, { useEffect, useState } from "react";
import { getProducts, updateStock, formatPrice } from "../api";

export default function SellerPage() {
  const [rows, setRows] = useState([]);
  const [pending, setPending] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    setPending(true);
    getProducts()
      .then((list) => alive && setRows(list.slice(0, 50))) // on en charge 50 pour l’exemple
      .catch((e) => setErr(e.message || String(e)))
      .finally(() => alive && setPending(false));
    return () => { alive = false; };
  }, []);

  const change = (id, field, value) => {
    setRows((cur) => cur.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const save = async (row) => {
    const patch = { price: Number(row.price) || 0, stock: Number(row.stock) || 0 };
    await updateStock(row.id, patch);
  };

  if (pending) return <div style={s.wrap}>Chargement…</div>;
  if (err) return <div style={s.wrap}>Erreur : {err}</div>;

  return (
    <div style={s.wrap}>
      <h1>Stocks vendeur</h1>
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr><th>ID</th><th>Produit</th><th>Prix</th><th>Stock</th><th>Action</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>
                  <input
                    type="number"
                    value={r.price}
                    onChange={(e) => change(r.id, "price", e.target.value)}
                    style={s.input}
                  />
                  <div style={{ fontSize: 12, color: "#666" }}>{formatPrice(r.price)}</div>
                </td>
                <td>
                  <input
                    type="number"
                    value={r.stock}
                    onChange={(e) => change(r.id, "stock", e.target.value)}
                    style={s.input}
                  />
                </td>
                <td><button style={s.btn} onClick={() => save(r)}>Enregistrer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const s = {
  wrap: { padding: 16, maxWidth: 1100, margin: "0 auto" },
  tableWrap: { overflow: "auto", border: "1px solid #eee", borderRadius: 12 },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0 },
  input: { width: 120, padding: "6px 8px", borderRadius: 8, border: "1px solid #ddd" },
  btn: { padding: "8px 12px", background: "black", color: "#fff", border: 0, borderRadius: 8, cursor: "pointer" },
};
