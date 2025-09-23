import React from "react";
import { getProducts } from "../api/index.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Catalog() {
  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState([]);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (e) {
        console.error(e);
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (error) return <p style={{color:"#b91c1c"}}>Erreur: {error}</p>;

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Catalogue</h1>
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))",
        gap:16
      }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
