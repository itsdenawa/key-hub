"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { useCartStore } from "@/features/cart/cart-store";
import { formatMoney } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";

export function CartSummary() {
  const itemsCount = useCartStore((state) => state.getItemsCount());
  const totalCents = useCartStore((state) => state.getTotalCents());

  return (
    <Link
      href="/cart"
      aria-label="Open cart summary"
      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
    >
      <ShoppingBag data-icon="inline-start" />
      <span>{itemsCount} items</span>
      <span className="text-muted-foreground">{formatMoney(totalCents)}</span>
    </Link>
  );
}
