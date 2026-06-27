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
  const [error, setError] = useState<string | null>(null);

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

    setError(null);
    setIsSaved(!previousSaved);
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
    } else {
      setIsSaved(previousSaved);
      setError("Wishlist could not be updated.");
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
      {error ? (
        <span className="absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border border-red-400/25 bg-[#1a0d16] p-2 text-xs text-red-100 shadow-xl">
          {error}
        </span>
      ) : null}
    </span>
  );
}
