"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/shared/types/catalog";

export type CartItem = {
  productId: string;
  title: string;
  slug: string;
  imageUrl: string;
  priceCents: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
  getItemsCount: () => number;
  getTotalCents: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addProduct: (product) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === product.id,
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                title: product.title,
                slug: product.slug,
                imageUrl: product.imageUrl,
                priceCents: product.priceCents,
                quantity: 1,
              },
            ],
          };
        }),
      removeProduct: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      clearCart: () => set({ items: [] }),
      getItemsCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalCents: () =>
        get().items.reduce(
          (total, item) => total + item.priceCents * item.quantity,
          0,
        ),
    }),
    {
      name: "keyhub-cart",
    },
  ),
);
