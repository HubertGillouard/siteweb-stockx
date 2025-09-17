import React, { useEffect, useState } from "react";
import { getProducts } from "../api";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, CardMedia, Typography, Button } from "@mui/material";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  return (
    <Grid container spacing={2} padding={2}>
      {products.map(p => (
        <Grid item xs={12} sm={6} md={4} key={p.id}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={p.image || "https://via.placeholder.com/200"}
              alt={p.name}
            />
            <CardContent>
              <Typography variant="h6">{p.name}</Typography>
              <Typography color="text.secondary">{p.brand}</Typography>
              <Typography>${p.price}</Typography>
              <Button component={Link} to={`/product/${p.id}`} variant="contained" size="small">
                Voir
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
