"use client";

import { ShoppingCart } from "lucide-react";

import { useCartStore } from "@/features/cart/cart-store";
import type { Product } from "@/shared/types/catalog";
import { Button } from "@/shared/ui/button";

type AddToCartButtonProps = {
  product: Product;
  size?: "default" | "sm" | "lg";
  className?: string;
};

export function AddToCartButton({
  product,
  size = "default",
  className,
}: AddToCartButtonProps) {
  const addProduct = useCartStore((state) => state.addProduct);

  return (
    <Button
      type="button"
      size={size}
      className={className}
      onClick={() => addProduct(product)}
    >
      <ShoppingCart data-icon="inline-start" />
      Add to cart
    </Button>
  );
}
