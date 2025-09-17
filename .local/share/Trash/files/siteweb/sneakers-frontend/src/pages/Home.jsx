import React, { useEffect, useState } from "react";
import { getProducts } from "../api/api";
import ProductCard from "../components/ProductCard";
import { Grid } from "@mui/material";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then(res => {
        const formatted = res.data.map(p => ({
          id: p.id,
          name: p.nom,   // <- backend utilise "nom"
          price: p.prix, // <- backend utilise "prix"
          link: p.link || "/placeholder.jpg"
        }));
        setProducts(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1>Nos Sneakers</h1>
      <Grid container spacing={2}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
