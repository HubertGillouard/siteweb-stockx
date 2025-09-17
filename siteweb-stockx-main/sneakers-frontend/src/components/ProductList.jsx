import { useEffect, useState } from "react";
import { getProducts, getImages, deleteProduct } from "../api";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      const data = res.data;

      const productsWithImages = await Promise.all(
        data.map(async (product) => {
          const imgRes = await getImages(product.id);
          return {
            ...product,
            image: imgRes.data[0]?.url || "/placeholder.jpg",
          };
        })
      );

      setProducts(productsWithImages);
    } catch (error) {
      console.error("Erreur de chargement:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Produits</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <img src={p.image} alt={p.name} width={50} style={{ marginRight: 10 }} />
            {p.name} - ${p.price}{" "}
            <button onClick={() => handleDelete(p.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
