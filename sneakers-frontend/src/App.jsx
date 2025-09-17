import React, { useState } from "react";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import AdminDashboard from "./components/AdminDashboard";
import { Button } from "@mui/material";

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adminMode, setAdminMode] = useState(false);

  if (adminMode) {
    return (
      <>
        <Button onClick={() => setAdminMode(false)}>Retour Boutique</Button>
        <AdminDashboard />
      </>
    );
  }

  if (selectedProduct) {
    return (
      <>
        <Button onClick={() => setSelectedProduct(null)}>← Retour</Button>
        <Button onClick={() => setAdminMode(true)}>Admin</Button>
        <ProductDetail productId={selectedProduct} />
      </>
    );
  }

  return (
    <>
      <Button onClick={() => setAdminMode(true)}>Admin</Button>
      <ProductList onSelect={setSelectedProduct} />
    </>
  );
}

export default App;
