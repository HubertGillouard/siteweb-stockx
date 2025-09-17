import React, { useEffect, useState } from "react";
import { getProducts } from "../api/api";
import { Grid, Card, CardContent, Typography, Button, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then(res => {
        const formatted = res.data.map(p => ({
          id: p.id,
          name: p.name,   // ici on utilise bien name
          price: p.price, // ici price
          link: p.link || "/placeholder.jpg"
        }));
        setProducts(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  if (!products.length) return <div>Chargement des produits...</div>;

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {products.map(p => (
        <Grid item xs={12} sm={6} md={4} key={p.id}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardMedia
              component="img"
              height="200"
              image={p.link}
              alt={p.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{p.name}</Typography>
              <Typography variant="body2">{p.price}</Typography>
            </CardContent>
            <Button onClick={() => navigate(`/product/${p.id}`)}>Voir détails</Button>
          </Card>
        </Grid>
      ))}
    </Grid>
    
  );
}
