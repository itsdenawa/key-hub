"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type WishlistButtonProps = {
  productId: string;
  className?: string;
};

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isPending, setIsPending] = useState(false);

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
    setIsPending(true);

    const response = await fetch(`/api/wishlist/${productId}`, {
      method: "POST",
    });

    if (response.status === 401) {
      window.location.href = `/auth/sign-in?next=${encodeURIComponent(
        window.location.pathname,
      )}`;
      return;
    }

    const payload = (await response.json()) as {
      saved?: boolean;
    };

    if (response.ok) {
      setIsSaved(Boolean(payload.saved));
    }

    setIsPending(false);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={isSaved}
      className={cn(isSaved && "text-rose-600", className)}
      disabled={isPending}
      onClick={toggleWishlist}
      data-product-id={productId}
    >
      <Heart className={cn(isSaved && "fill-current")} />
    </Button>
  );
}
