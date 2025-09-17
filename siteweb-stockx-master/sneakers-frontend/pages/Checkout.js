import { useCart } from '../contexts/CartContext';

export default function Checkout() {
    const { cart, clearCart } = useCart();

    const handleOrder = async () => {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify({ items: cart }),
        });
        if (res.ok) clearCart();
    };

    return (
        <div>
            <h2>Panier</h2>
            {cart.map(item => <div key={item.id}>{item.name} x {item.quantity}</div>)}
            <button onClick={handleOrder}>Valider la commande</button>
        </div>
    );
}
