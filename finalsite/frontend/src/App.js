import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  // Charger les produits
  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(response => response.json())
      .then(data => setProducts(data.products));
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Boutique Nike</h1>
        {user ? (
          <span>Bienvenue {user.username}</span>
        ) : (
          <button>Se connecter</button>
        )}
      </header>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image_url} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}€</p>
            <button>Ajouter au panier</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;