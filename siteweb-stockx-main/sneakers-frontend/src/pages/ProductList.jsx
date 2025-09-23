// sneakers-frontend/src/pages/ProductList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, resolveImg } from "../api";

export default function ProductList() {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getProducts();
        if (alive) setItems(data);
      } catch (e) {
        console.error(e);
        setErr(String(e?.message || e));
      }
    })();
    return () => { alive = false; };
  }, []);

  if (err) {
    return (
      <div className="alert alert--error">
        <strong>Erreur :</strong> {err}
      </div>
    );
  }
  if (!items) return <p>Chargement du catalogue…</p>;

  return (
    <section>
      <h2>Catalogue</h2>
      <p className="muted">Produits chargés : {items.length}</p>

      <div className="grid">
        {items.map((p) => (
          <article key={p.id} className="card">
            <Link to={`/products/${p.id}`} className="card__imgwrap" title={p.name}>
              <img
                src={resolveImg(p.link)}
                alt={p.name}
                className="card__img"
                loading="lazy"
                onError={(e) => (e.currentTarget.src = "/api/images/placeholder.jpg")}
              />
            </Link>
            <div className="card__body">
              <h3 className="card__title">
                <Link to={`/products/${p.id}`}>{p.name}</Link>
              </h3>
              {typeof p.price === "number" && <div className="price">{p.price.toFixed(2)} €</div>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
