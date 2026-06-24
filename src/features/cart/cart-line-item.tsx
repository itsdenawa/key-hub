"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { type CartItem, useCartStore } from "@/features/cart/cart-store";
import { formatMoney } from "@/shared/lib/format";
import { Button } from "@/shared/ui/button";

type CartLineItemProps = {
  item: CartItem;
};

export function CartLineItem({ item }: CartLineItemProps) {
  const incrementProduct = useCartStore((state) => state.incrementProduct);
  const decrementProduct = useCartStore((state) => state.decrementProduct);
  const removeProduct = useCartStore((state) => state.removeProduct);

  return (
    <div className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-[112px_1fr_auto]">
      <Link
        href={`/products/${item.slug}`}
        className="block overflow-hidden rounded-lg bg-muted"
      >
        <Image
          src={item.imageUrl}
          alt={item.title}
          width={224}
          height={168}
          className="aspect-[4/3] w-full object-cover"
        />
      </Link>
      <div className="min-w-0">
        <Link
          href={`/products/${item.slug}`}
          className="font-semibold hover:underline"
        >
          {item.title}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatMoney(item.priceCents)} each
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={`Decrease ${item.title} quantity`}
            onClick={() => decrementProduct(item.productId)}
          >
            <Minus />
          </Button>
          <span className="flex h-7 min-w-8 items-center justify-center rounded-lg border border-border px-2 text-sm">
            {item.quantity}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={`Increase ${item.title} quantity`}
            onClick={() => incrementProduct(item.productId)}
          >
            <Plus />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove ${item.title}`}
            onClick={() => removeProduct(item.productId)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
      <p className="font-semibold sm:text-right">
        {formatMoney(item.priceCents * item.quantity)}
      </p>
    </div>
  );
}
