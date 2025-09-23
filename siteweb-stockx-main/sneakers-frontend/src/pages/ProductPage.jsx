// sneakers-frontend/src/pages/ProductList.jsx
import React, { useEffect, useState } from "react";
import { getProducts, ensureArray } from "../api";
import ProductCard from "../components/ProductCard.jsx";

export default function ProductList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getProducts();
        if (alive) setRows(ensureArray(data));
      } catch (e) {
        console.error(e);
        setErr(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <p style={{ padding: 16 }}>Chargement…</p>;
  if (err) return <p style={{ padding: 16, color: "crimson" }}>Erreur : {String(err)}</p>;
  if (!rows.length) return <p style={{ padding: 16 }}>Aucun produit à afficher.</p>;

  return (
    <div style={{ padding: 16, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
      {rows.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
