"use client";
import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  size?: string;
  crust?: string;
  price: number;
  quantity: number;
  image: string;
  note?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      // simple push; could merge duplicates later
      return [...prev, item];
    });
  }

  return (
    <CartContext.Provider value={{ items, addItem }}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be within CartProvider");
  return ctx;
}
