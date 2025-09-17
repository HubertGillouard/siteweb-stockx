import React, { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  createVariant,
} from '../api/api';
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Divider,
} from "@mui/material";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });

  const refresh = () => getProducts().then((res) => setProducts(res.data));

  useEffect(() => {
    refresh();
  }, []);

  const handleAddProduct = async () => {
    await createProduct(newProduct);
    setNewProduct({ name: "", price: "" });
    refresh();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    refresh();
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4">Admin Dashboard</Typography>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Ajouter un produit</Typography>
      <TextField
        label="Nom"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        sx={{ mr: 1 }}
      />
      <TextField
        label="Prix"
        value={newProduct.price}
        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        sx={{ mr: 1 }}
      />
      <Button variant="contained" onClick={handleAddProduct}>
        Ajouter
      </Button>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Produits existants</Typography>
      <List>
        {products.map((p) => (
          <ListItem
            key={p.id}
            secondaryAction={
              <Button color="error" onClick={() => handleDelete(p.id)}>
                Supprimer
              </Button>
            }
          >
            {p.name} - {p.price} €
          </ListItem>
        ))}
      </List>
    </div>
  );
}
