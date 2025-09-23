import React from "react";
import { Link } from "react-router-dom";
import { resolveImg, formatPrice } from "../api";

export default function ProductCard({ product }) {
  if (!product) return null;

  const img = resolveImg(product.link);
  const price = formatPrice(product.price);

  return (
    <div className="product-card" style={styles.card}>
      <Link to={`/product/${product.id}`} style={styles.link} aria-label={product.name}>
        <img
          src={img}
          alt={product.name}
          style={styles.img}
          loading="lazy"
          decoding="async"
        />
        <div style={styles.body}>
          <h3 style={styles.title}>{product.name}</h3>
          <div style={styles.price}>{price}</div>
        </div>
      </Link>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #eee",
    borderRadius: 12,
    overflow: "hidden",
    background: "#fff",
    transition: "transform .15s ease",
  },
  link: { color: "inherit", textDecoration: "none", display: "block" },
  img: { display: "block", width: "100%", height: "auto", aspectRatio: "1/1", objectFit: "cover" },
  body: { padding: 12 },
  title: { margin: "0 0 6px", fontSize: 16, lineHeight: 1.2 },
  price: { fontWeight: 600 },
};
