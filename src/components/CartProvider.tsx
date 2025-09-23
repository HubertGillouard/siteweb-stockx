import React from 'react';
import { CartContext, useCartProvider } from '../hooks/useCart';

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const cart = useCartProvider();

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
}