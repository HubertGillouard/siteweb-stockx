import React, { useEffect, useState } from "react";
import { getProducts } from "../api/api";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";

export default function ProductList({ onSelect }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {products.map((p) => (
        <Grid item xs={12} sm={6} md={4} key={p.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{p.name}</Typography>
              <Typography variant="body2">{p.price} €</Typography>
              <Button onClick={() => onSelect(p.id)}>Voir détails</Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
