import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { CartItem } from '../types';
import { useAuth } from './useAuth';

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addItem: (productVariantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function useCartProvider() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCartItems = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product_variant:product_variants(
            *,
            product:products(
              *,
              brand:brands(*),
              images:product_images(*)
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  const addItem = async (productVariantId: string, quantity = 1) => {
    if (!user) return;

    try {
      // Check if item already exists
      const existingItem = items.find(item => item.product_variant_id === productVariantId);
      
      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_variant_id: productVariantId,
            quantity,
          });

        if (error) throw error;
        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const total = items.reduce((sum, item) => 
    sum + (item.product_variant?.price || 0) * item.quantity, 0);

  return {
    items,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    total,
  };
}

export { CartContext };