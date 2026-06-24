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
  incrementProduct: (productId: string) => void;
  decrementProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
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
      incrementProduct: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(item.quantity + 1, 9) }
              : item,
          ),
        })),
      decrementProduct: (productId) =>
        set((state) => ({
          items: state.items.flatMap((item) => {
            if (item.productId !== productId) {
              return item;
            }

            if (item.quantity <= 1) {
              return [];
            }

            return { ...item, quantity: item.quantity - 1 };
          }),
        })),
      removeProduct: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.min(Math.max(quantity, 1), 9) }
                : item,
            )
            .filter((item) => item.quantity > 0),
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
