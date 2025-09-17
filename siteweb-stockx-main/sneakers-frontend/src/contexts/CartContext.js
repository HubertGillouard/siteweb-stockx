import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    // Vérifie si l'article est déjà dans le panier
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const clearCart = () => setCart([]);

  const removeFromCart = (id) => {
    setCart(cart.filter(i => i.id !== id));
  };

  const checkoutCart = () => {
    // Paiement fictif
    alert("Commande passée ! ✅");
    clearCart();
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, checkoutCart }}>
      {children}
    </CartContext.Provider>
  );
};
