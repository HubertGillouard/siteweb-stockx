import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getCart as apiGet,
  addToCart as apiAdd,
  updateCartItem as apiUpd,
  removeFromCart as apiDel,
  clearCart as apiClear,
} from "../api";

const Ctx = createContext(null);

/**
 * Fournit le panier (items, count, totals) + actions (add/update/remove/clear).
 * Stockage principal: localStorage via les helpers de ../api
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Chargement initial depuis localStorage
  useEffect(() => {
    try {
      setItems(apiGet() || []);
    } catch {
      setItems([]);
    }
  }, []);

  // Reste synchro si un autre onglet modifie le storage
  useEffect(() => {
    function onStorage(e) {
      // on ne connaît pas la clé exacte ici (elle est dans ../api),
      // donc on recharge le panier à chaque event storage.
      try {
        setItems(apiGet() || []);
      } catch {}
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Actions
  async function add(productId, qty = 1, size) {
    const next = await apiAdd(productId, qty, size);
    setItems(next || []);
  }
  function update(productId, qty, size) {
    const next = apiUpd(productId, qty, size);
    setItems(next || []);
  }
  function remove(productId, size) {
    const next = apiDel(productId, size);
    setItems(next || []);
  }
  function clear() {
    const next = apiClear();
    setItems(next || []);
  }

  // Dérivés (totaux simples)
  const { count, subtotal, shipping, total } = useMemo(() => {
    const count = (items || []).reduce((n, it) => n + Number(it.qty || 0), 0);
    const subtotal = (items || []).reduce(
      (s, it) => s + Number(it.price || 0) * Number(it.qty || 0),
      0
    );
    const shipping = subtotal > 150 ? 0 : (count > 0 ? 6.9 : 0);
    const total = subtotal + shipping;
    return { count, subtotal, shipping, total };
  }, [items]);

  const value = useMemo(
    () => ({ items, count, subtotal, shipping, total, add, update, remove, clear }),
    [items, count, subtotal, shipping, total]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

// (optionnel) pour compat avec d’anciens imports par défaut
export default CartProvider;
