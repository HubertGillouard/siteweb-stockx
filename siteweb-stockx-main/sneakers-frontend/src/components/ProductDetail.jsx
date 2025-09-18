import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../api/api";
import { CartContext } from "../contexts/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    getProduct(id)
      .then(res => {
        const p = res.data;
        setProduct({
          id: p.id,
          name: p.name || p.nom,    // <- backend peut renvoyer name ou nom
          price: Number(p.price || p.prix),  // <- backend peut renvoyer price ou prix
          link: p.link || "/placeholder.jpg"
        });
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <div>Chargement...</div>;

  return (
    <div className="product-detail">
      <img src={product.link} alt={product.name} style={{ width: "300px" }} />
      <h2>{product.name}</h2>
      <p>{product.price.toFixed(2)} €</p>
      <button onClick={() => addToCart(product)}>Ajouter au panier</button>
    </div>
  );
}
