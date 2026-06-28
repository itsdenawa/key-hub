"use client";

import { Loader2, LockKeyhole } from "lucide-react";
import { useState } from "react";

import { useCartStore } from "@/features/cart/cart-store";
import { Button } from "@/shared/ui/button";
import { useToast } from "@/shared/ui/toast";

type CheckoutButtonProps = {
  disabled?: boolean;
};

export function CheckoutButton({ disabled }: CheckoutButtonProps) {
  const items = useCartStore((state) => state.items);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { showToast } = useToast();

  async function startCheckout() {
    setError(null);
    setIsPending(true);
    showToast({
      description: "Preparing your Stripe Checkout session.",
      title: "Starting checkout",
      tone: "info",
    });

    let response: Response;

    try {
      response = await fetch("/api/checkout", {
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
    } catch {
      const message = "Network error. Please check your connection.";

      setError(message);
      showToast({
        description: message,
        title: "Checkout failed",
        tone: "error",
      });
      setIsPending(false);
      return;
    }

    if (response.status === 401) {
      showToast({
        description:
          "Sign in first so your entitlements and downloads can be attached to your account.",
        title: "Authentication required",
        tone: "info",
      });
      window.location.href = `/auth/sign-in?next=${encodeURIComponent("/cart")}`;
      return;
    }

    const payload = (await response.json()) as {
      error?: string;
      url?: string;
    };

    if (!response.ok || !payload.url) {
      const message = payload.error ?? "Checkout could not be started.";

      setError(message);
      showToast({
        description: message,
        title: "Checkout failed",
        tone: "error",
      });
      setIsPending(false);
      return;
    }

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
