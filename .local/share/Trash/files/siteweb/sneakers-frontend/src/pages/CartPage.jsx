import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { Button, Grid, Typography, Card, CardContent, CardMedia } from "@mui/material";

export default function CartPage() {
  const { cart, removeFromCart, checkout } = useContext(CartContext);

  if (cart.length === 0) return <Typography>Panier vide</Typography>;

  const total = cart.reduce((sum, item) => sum + parseFloat(item.prix) * item.quantity, 0);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>Votre Panier</Typography>
      <Grid container spacing={2}>
        {cart.map(item => (
          <Grid item xs={12} md={6} key={item.id}>
            <Card sx={{ display: 'flex' }}>
              <CardMedia
                component="img"
                sx={{ width: 140 }}
                image={item.link || "/placeholder.jpg"}
                alt={item.nom}
              />
              <CardContent>
                <Typography variant="h6">{item.nom}</Typography>
                <Typography>{item.prix} € x {item.quantity}</Typography>
                <Button color="error" onClick={() => removeFromCart(item.id)}>Supprimer</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h5" sx={{ mt: 2 }}>Total: {total.toFixed(2)} €</Typography>
      <Button variant="contained" color="primary" onClick={checkout}>Passer commande</Button>
    </div>
  );
}
