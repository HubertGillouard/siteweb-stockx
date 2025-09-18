import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getProduct, getImages } from "../api/api";
import { CartContext } from "../contexts/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProduct(id);
        const p = res.data;
        const imgRes = await getImages(p.id);

        setProduct({
          ...p,
          price: Number(p.price),
          link: imgRes.data[0]?.url || "/placeholder.jpg"
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Chargement...</div>;

  return (
    <div style={{ padding: "2rem", display: "flex", gap: "2rem" }}>
      <img src={product.link} alt={product.name} style={{ width: "300px", borderRadius: "8px" }} />
      <div>
        <h2>{product.name}</h2>
        <p style={{ fontWeight: "bold" }}>{product.price.toFixed(2)} €</p>
        <button onClick={() => addToCart(product)} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
