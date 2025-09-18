import React, { useContext } from "react";
import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  return (
    <Card sx={{ maxWidth: 345, m: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="200"
        image={product.link || "/placeholder.jpg"}
        alt={product.name}
        style={{ objectFit: "contain", padding: "10px", backgroundColor: "#f9f9f9" }}
      />
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {product.price} €
        </Typography>
        <Button onClick={() => navigate(`/product/${product.id}`)}>
          Voir détails
        </Button>
        <Button onClick={() => addToCart(product)} sx={{ ml: 2 }}>
          Ajouter au panier
        </Button>
      </CardContent>
    </Card>
  );
}
