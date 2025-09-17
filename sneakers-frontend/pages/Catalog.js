import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

export default function Catalog() {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    return (
        <div>
            {products.map(product => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <button onClick={() => addToCart(product)}>Ajouter au panier</button>
                </div>
            ))}
        </div>
    );
}
