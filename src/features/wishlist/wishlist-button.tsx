"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type WishlistButtonProps = {
  productId: string;
  className?: string;
};

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={isSaved}
      className={cn(isSaved && "text-rose-600", className)}
      onClick={() => setIsSaved((value) => !value)}
      data-product-id={productId}
    >
      <Heart className={cn(isSaved && "fill-current")} />
    </Button>
  );
}
