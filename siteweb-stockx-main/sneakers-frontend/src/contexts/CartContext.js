import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Ajouter un produit au panier
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Supprimer un produit du panier
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  // Calculer le total du panier
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Simuler le checkout (paiement fictif)
  const checkoutCart = async () => {
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart })
      });
      const paymentResult = await response.json();

      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, paymentId: paymentResult.id })
      });
      const order = await orderResponse.json();

      clearCart();
      return order; // renvoie l'objet order avec son id
    } catch (error) {
      console.error("Erreur lors du paiement :", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      checkoutCart,
      updateQuantity,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
