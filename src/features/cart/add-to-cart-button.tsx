"use client";

import { ShoppingCart } from "lucide-react";

import { useCartStore } from "@/features/cart/cart-store";
import type { Product } from "@/shared/types/catalog";
import { Button } from "@/shared/ui/button";
import { useToast } from "@/shared/ui/toast";

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
  const { showToast } = useToast();

  function handleAddToCart() {
    addProduct(product);
    showToast({
      description: "The item is ready in your cart.",
      title: `${product.title} added`,
      tone: "success",
    });
  }

  return (
    <Button
      type="button"
      size={size}
      className={className}
      onClick={handleAddToCart}
      aria-label={showLabel ? undefined : `Add ${product.title} to cart`}
    >
      <ShoppingCart data-icon="inline-start" />
      {showLabel ? "Add to cart" : null}
    </Button>
  );
}
