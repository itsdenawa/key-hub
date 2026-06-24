"use client";

import { ShoppingCart } from "lucide-react";

import { useCartStore } from "@/features/cart/cart-store";
import type { Product } from "@/shared/types/catalog";
import { Button } from "@/shared/ui/button";

type AddToCartButtonProps = {
  product: Product;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showLabel?: boolean;
};

export function AddToCartButton({
  product,
  size = "default",
  className,
  showLabel = true,
}: AddToCartButtonProps) {
  const addProduct = useCartStore((state) => state.addProduct);

  return (
    <Button
      type="button"
      size={size}
      className={className}
      onClick={() => addProduct(product)}
      aria-label={showLabel ? undefined : `Add ${product.title} to cart`}
    >
      <ShoppingCart data-icon="inline-start" />
      {showLabel ? "Add to cart" : null}
    </Button>
  );
}
