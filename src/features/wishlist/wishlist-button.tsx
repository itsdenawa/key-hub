"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { useToast } from "@/shared/ui/toast";

type WishlistButtonProps = {
  productId: string;
  className?: string;
};

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    let isActive = true;

    fetch(`/api/wishlist/${productId}`)
      .then((response) => response.json())
      .then((payload: { saved?: boolean }) => {
        if (isActive) {
          setIsSaved(Boolean(payload.saved));
        }
      })
      .catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, [productId]);

  async function toggleWishlist() {
    const previousSaved = isSaved;

    setIsSaved(!previousSaved);
    setIsPending(true);

    let response: Response;

    try {
      response = await fetch(`/api/wishlist/${productId}`, {
        method: "POST",
      });
    } catch {
      setIsSaved(previousSaved);
      setIsPending(false);
      showToast({
        description: "Please check your connection and try again.",
        title: "Wishlist could not be updated",
        tone: "error",
      });
      return;
    }

    if (response.status === 401) {
      showToast({
        description: "Sign in to save products across devices.",
        title: "Wishlist requires an account",
        tone: "info",
      });
      window.location.href = `/auth/sign-in?next=${encodeURIComponent(
        window.location.pathname,
      )}`;
      return;
    }

    const payload = (await response.json()) as {
      saved?: boolean;
    };

    if (response.ok) {
      const nextSaved = Boolean(payload.saved);

      setIsSaved(nextSaved);
      showToast({
        description: nextSaved
          ? "Saved products stay in your account."
          : "The product was removed from your saved list.",
        title: nextSaved ? "Saved to wishlist" : "Removed from wishlist",
        tone: "success",
      });
    } else {
      setIsSaved(previousSaved);
      showToast({
        description: "Please try again in a moment.",
        title: "Wishlist could not be updated",
        tone: "error",
      });
    }

    setIsPending(false);
  }

  return (
    <span className="relative inline-flex">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
        aria-pressed={isSaved}
        className={cn(isSaved && "text-rose-400", className)}
        disabled={isPending}
        onClick={toggleWishlist}
        data-product-id={productId}
      >
        <Heart className={cn(isSaved && "fill-current")} />
      </Button>
    </span>
  );
}
