// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { getProducts, getImages } from "../api/api";
import ProductCard from "../components/ProductCard";
import { Grid, Typography } from "@mui/material";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        const prods = res.data;

        const productsWithImages = await Promise.all(
          prods.map(async (p) => {
            const imgRes = await getImages(p.id);
            return {
              id: p.id,
              name: p.name,   // colonne "name"
              price: p.price, // colonne "price"
              link: imgRes.data[0]?.url || "/placeholder.jpg"
            };
          })
        );

        setProducts(productsWithImages);
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container" style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Nos Sneakers
      </Typography>

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
