import React, { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct } from "../api/api";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data.map(p => ({ ...p, price: Number(p.price) })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async () => {
    if (!name || !price) return alert("Remplissez tous les champs");
    try {
      await createProduct({ name, price });
      setName("");
      setPrice("");
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div style={{ marginBottom: "2rem" }}>
        <h2>Ajouter un produit</h2>
        <input placeholder="Nom" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Prix" value={price} onChange={e => setPrice(e.target.value)} type="number" />
        <button onClick={handleCreate}>Créer</button>
      </div>

      <h2>Liste des produits</h2>
      {products.map(p => (
        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span>{p.name} - {p.price.toFixed(2)} €</span>
          <button onClick={() => handleDelete(p.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
}
