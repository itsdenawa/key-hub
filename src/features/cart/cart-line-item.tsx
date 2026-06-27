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
    <article className="grid gap-4 rounded-lg border border-white/10 bg-[#071020]/85 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:grid-cols-[132px_minmax(0,1fr)] xl:grid-cols-[132px_minmax(0,1fr)_140px]">
      <Link
        href={`/products/${item.slug}`}
        className="block overflow-hidden rounded-lg border border-white/10 bg-[#0a1223]"
      >
        <Image
          src={item.imageUrl}
          alt={item.title}
          width={264}
          height={198}
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
        />
      </Link>

      <div className="min-w-0">
        <Link
          href={`/products/${item.slug}`}
          className="line-clamp-1 text-lg font-bold text-white hover:text-violet-300"
        >
          {item.title}
        </Link>
        <p className="mt-1 text-sm text-slate-400">
          {formatMoney(item.priceCents)} each · instant digital delivery
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={`Decrease ${item.title} quantity`}
            className="border-white/10 bg-white/[0.035] text-white hover:bg-white/[0.08]"
            onClick={() => decrementProduct(item.productId)}
          >
            <Minus />
          </Button>
          <span className="flex h-8 min-w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] px-3 text-sm font-bold text-white">
            {item.quantity}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={`Increase ${item.title} quantity`}
            className="border-white/10 bg-white/[0.035] text-white hover:bg-white/[0.08]"
            onClick={() => incrementProduct(item.productId)}
          >
            <Plus />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove ${item.title}`}
            className="text-slate-400 hover:bg-red-500/10 hover:text-red-200"
            onClick={() => removeProduct(item.productId)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 xl:block xl:border-t-0 xl:pt-0 xl:text-right">
        <span className="text-sm text-slate-400 xl:hidden">Line total</span>
        <p className="text-xl font-black text-white">
          {formatMoney(item.priceCents * item.quantity)}
        </p>
      </div>
    </article>
  );
}
