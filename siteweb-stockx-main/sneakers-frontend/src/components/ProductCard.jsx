import React from "react";
import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";

export default function ProductCard({ product, onSelect }) {
  return (
    <Card sx={{ maxWidth: 345, m: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="200"
        image={product.link || "/placeholder.jpg"} // affiche ton image ou un placeholder
        alt={product.nom}
        style={{ objectFit: "contain", padding: "10px", backgroundColor: "#f9f9f9" }}
      />
      <CardContent>
        <Typography variant="h6">{product.nom}</Typography>
        <Typography variant="body2" color="text.secondary">
          {product.prix} €
        </Typography>
        <Button onClick={() => onSelect(product.id)}>Voir détails</Button>
      </CardContent>
    </Card>
  );
}
