import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct, resolveImg, formatPrice } from "../api";
import { useCart } from "../contexts/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart(); // CartContext doit exposer { add(productId, qty, size?) }
  const [product, setProduct] = useState(null);
  const [pending, setPending] = useState(true);
  const [err, setErr] = useState(null);
  const [size, setSize] = useState("");

  useEffect(() => {
    let alive = true;
    setPending(true);
    getProduct(id)
      .then((p) => { if (alive) { setProduct(p); setErr(null); }})
      .catch((e) => setErr(e.message || String(e)))
      .finally(() => alive && setPending(false));
    return () => { alive = false; };
  }, [id]);

  if (pending) return <div style={s.box}>Chargement…</div>;
  if (err) return <div style={s.box}>Erreur : {err}</div>;
  if (!product) return <div style={s.box}>Introuvable</div>;

  const img = resolveImg(product.link);
  const price = formatPrice(product.price);

  // si le backend expose product.sizes: [{size, stock}], on les liste
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];

  return (
    <div style={s.page}>
      <div style={s.breadcrumbs}>
        <Link to="/" style={s.a}>Catalogue</Link> / <strong>{product.name}</strong>
      </div>

      <div style={s.wrap}>
        <div style={s.media}>
          <img
            src={img}
            alt={product.name}
            style={s.img}
            loading="eager"
            decoding="async"
          />
        </div>

        <div style={s.info}>
          <h1 style={{ marginTop: 0 }}>{product.name}</h1>
          <div style={s.price}>{price}</div>

          {sizes.length > 0 && (
            <div style={{ margin: "12px 0" }}>
              <label htmlFor="size">Taille</label>
              <select
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                style={s.select}
              >
                <option value="">Sélectionne</option>
                {sizes.map((s) => (
                  <option key={s.size} value={s.size} disabled={s.stock <= 0}>
                    {s.size} {s.stock > 0 ? `(${s.stock} dispo)` : "(rupture)"}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            style={s.cta}
            onClick={() => add(product.id, 1, size || undefined)}
          >
            Ajouter au panier
          </button>

          {product.description && (
            <p style={{ marginTop: 16, color: "#444" }}>{product.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: 16, maxWidth: 1000, margin: "0 auto" },
  breadcrumbs: { marginBottom: 12 },
  a: { color: "#0a66c2" },
  wrap: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  media: { background: "#fafafa", border: "1px solid #eee", borderRadius: 12, padding: 12 },
  img: { width: "100%", height: "auto", display: "block", borderRadius: 8, objectFit: "cover" },
  info: { padding: 12 },
  price: { fontSize: 24, fontWeight: 700, margin: "8px 0 16px" },
  select: { display: "block", padding: "8px 10px", marginTop: 6 },
  cta: {
    display: "inline-block",
    marginTop: 8,
    padding: "10px 14px",
    background: "black",
    color: "white",
    border: 0,
    borderRadius: 8,
    cursor: "pointer",
  },
};
