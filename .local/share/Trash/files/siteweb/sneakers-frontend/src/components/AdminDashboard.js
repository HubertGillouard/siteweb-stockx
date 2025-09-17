import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../api/api';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div>
      <h1>Dashboard Admin</h1>
      {products.map(p => (
        <div key={p.id}>
          <span>{p.name}</span>
          <button onClick={() => handleDelete(p.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
}
