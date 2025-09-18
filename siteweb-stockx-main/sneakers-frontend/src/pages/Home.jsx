import React, { useEffect, useState } from "react";
import { getProducts, getImages } from "../api/api";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getProducts();
      const data = await Promise.all(res.data.map(async p => {
        const imgRes = await getImages(p.id);
        return {
          ...p,
          price: Number(p.price),
          link: imgRes.data[0]?.url || "/placeholder.jpg"
        };
      }));
      setProducts(data);
    };
    fetch();
  }, []);

  return (
    <div className="container">
      <h1>Nos Sneakers</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "1rem" }}>
        {products.map(p => (
          <Link key={p.id} to={`/product/${p.id}`} className="product-card">
            <img src={p.link} alt={p.name} />
            <div className="product-card-content">
              <h2>{p.name}</h2>
              <p>{p.price.toFixed(2)} €</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
