import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { Typography, Button, List, ListItem } from "@mui/material";

export default function Cart() {
  const { cart, clearCart } = useContext(CartContext);

  const total = cart.reduce((acc, item) => acc + item.variant.price * item.qty, 0);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4">Panier</Typography>
      <List>
        {cart.map((item, idx) => (
          <ListItem key={idx}>
            {item.variant.name} - {item.variant.size}/{item.variant.color} x {item.qty} = ${item.variant.price * item.qty}
          </ListItem>
        ))}
      </List>
      <Typography variant="h6">Total : ${total}</Typography>
      <Button component={Link} to="/checkout" variant="contained" style={{ marginRight: "10px" }}>
        Commander
      </Button>
      <Button onClick={clearCart} variant="outlined">Vider le panier</Button>
    </div>
  );
}
