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
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "relative h-11 rounded-lg border-white/10 bg-white/[0.045] px-4 text-white hover:bg-white/10",
      )}
    >
      <ShoppingBag data-icon="inline-start" />
      <span>Cart</span>
      <span className="rounded-full bg-violet-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
        {itemsCount}
      </span>
      <span className="sr-only">{formatMoney(totalCents)}</span>
    </Link>
  );
}
