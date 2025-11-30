"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product, ProductVariant, CartItem } from "@/lib/schema";

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  isWholesale: boolean;
  setIsWholesale: (value: boolean) => void;
  addItem: (
    product: Product,
    variant?: ProductVariant,
    quantity?: number
  ) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string | undefined,
    quantity: number
  ) => void;
  clearCart: () => void;
  getItemPrice: (item: CartItem) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("grocery-cart");
    return stored ? JSON.parse(stored) : [];
  });
  const [isWholesale, setIsWholesale] = useState(() => {
    return localStorage.getItem("grocery-wholesale") === "true";
  });

  useEffect(() => {
    localStorage.setItem("grocery-cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("grocery-wholesale", isWholesale.toString());
  }, [isWholesale]);

  const getItemPrice = (item: CartItem) => {
    const basePrice =
      isWholesale && item.product.wholesale_available
        ? item.product.wholesale_price
        : item.product.retail_price;
    const adjustment = item.variant?.price_adjustment || 0;
    return basePrice + adjustment;
  };

  const total = items.reduce((sum, item) => {
    return sum + getItemPrice(item) * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (
    product: Product,
    variant?: ProductVariant,
    quantity = 1
  ) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          (item.variant?.id || null) === (variant?.id || null)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [...prev, { product, variant, quantity }];
    });
  };

  const removeItem = (productId: string, variantId?: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (item.variant?.id || null) === (variantId || null)
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    variantId: string | undefined,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        (item.variant?.id || null) === (variantId || null)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        isWholesale,
        setIsWholesale,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
