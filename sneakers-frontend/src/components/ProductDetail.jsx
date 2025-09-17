import React, { useEffect, useState, useContext } from "react";
import { getProduct, getVariants } from "../api/api";
import { useParams } from "react-router-dom";
import { Typography, Button, Select, MenuItem } from "@mui/material";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    getProduct(id).then(res => setProduct(res.data));
    getVariants(id).then(res => setVariants(res.data));
  }, [id]);

  const handleAdd = () => {
    if (!selectedVariant) return alert("Sélectionne une variante");
    addToCart({ variant: selectedVariant, qty });
  };

  if (!product) return <Typography>Chargement...</Typography>;

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4">{product.name}</Typography>
      <Typography variant="h6">{product.brand}</Typography>
      <img src={product.image || "https://via.placeholder.com/400"} alt={product.name} height={300} />
      <Typography variant="h5">${product.price}</Typography>

      <Select
        value={selectedVariant?.id || ""}
        onChange={(e) => setSelectedVariant(variants.find(v => v.id === e.target.value))}
      >
        {variants.map(v => (
          <MenuItem key={v.id} value={v.id}>
            {v.size} - {v.color}
          </MenuItem>
        ))}
      </Select>

      <input
        type="number"
        min="1"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        style={{ width: "60px", marginLeft: "10px" }}
      />
      <Button variant="contained" onClick={handleAdd} style={{ marginLeft: "10px" }}>
        Ajouter au panier
      </Button>
    </div>
  );
}
