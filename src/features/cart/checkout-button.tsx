"use client";

import { Loader2, LockKeyhole } from "lucide-react";
import { useState } from "react";

import { useCartStore } from "@/features/cart/cart-store";
import { Button } from "@/shared/ui/button";

type CheckoutButtonProps = {
  disabled?: boolean;
};

export function CheckoutButton({ disabled }: CheckoutButtonProps) {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function startCheckout() {
    setError(null);
    setIsPending(true);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    });

    if (response.status === 401) {
      window.location.href = `/auth/sign-in?next=${encodeURIComponent("/cart")}`;
      return;
    }

    const payload = (await response.json()) as {
      error?: string;
      url?: string;
    };

    if (!response.ok || !payload.url) {
      setError(payload.error ?? "Checkout could not be started.");
      setIsPending(false);
      return;
    }

    clearCart();
    window.location.href = payload.url;
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={disabled || isPending}
        onClick={startCheckout}
      >
        {isPending ? <Loader2 className="animate-spin" /> : <LockKeyhole />}
        Checkout securely
      </Button>
      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
