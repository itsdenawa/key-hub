"use client";

import { useEffect } from "react";

import { useCartStore } from "@/features/cart/cart-store";

type CheckoutReturnHandlerProps = {
  mode: "cancelled" | "success";
};

export function CheckoutReturnHandler({ mode }: CheckoutReturnHandlerProps) {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (mode === "success") {
      clearCart();
    }
  }, [clearCart, mode]);

  if (mode === "cancelled") {
    return (
      <div className="rounded-lg border border-amber-400/25 bg-amber-500/10 p-4 text-sm text-amber-100">
        Checkout was cancelled. Your cart is still here when you are ready.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-emerald-400/25 bg-emerald-500/10 p-4 text-sm text-emerald-100">
      Payment received. Your cart has been cleared and fulfillment is being
      finalized.
    </div>
  );
}
