"use client";

import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  LockKeyhole,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { CartLineItem } from "@/features/cart/cart-line-item";
import { useCartStore } from "@/features/cart/cart-store";
import { CheckoutButton } from "@/features/cart/checkout-button";
import { CheckoutReturnHandler } from "@/features/cart/checkout-return-handler";
import { formatMoney } from "@/shared/lib/format";
import { buttonVariants } from "@/shared/ui/button";

type CartViewProps = {
  checkoutState?: string;
};

export function CartView({ checkoutState }: CartViewProps) {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const itemsCount = useCartStore((state) => state.getItemsCount());
  const totalCents = useCartStore((state) => state.getTotalCents());

  if (items.length === 0) {
    return (
      <main className="bg-[#050814] text-white">
        <section className="mx-auto flex min-h-[520px] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <div className="grid size-16 place-items-center rounded-2xl border border-violet-400/30 bg-violet-500/15 text-violet-200">
            <PackageCheck className="size-8" />
          </div>
          <h1 className="mt-6 text-[34px] font-black leading-tight">
            Your cart is empty
          </h1>
          <p className="mt-3 max-w-xl text-slate-400">
            Add games, keys, subscriptions, templates, or courses before
            checkout.
          </p>
          <Link
            href="/products"
            className={buttonVariants({
              className:
                "mt-7 h-11 bg-gradient-to-r from-violet-600 to-blue-500 px-5 text-white hover:from-violet-500 hover:to-blue-400",
            })}
          >
            Browse catalog
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#050814] text-white">
      <div className="mx-auto w-full max-w-[1440px] space-y-7 px-4 py-8 sm:px-6 lg:px-8 2xl:px-0">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-slate-300">Cart</span>
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[34px] font-black leading-tight sm:text-[38px]">
              Cart
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {itemsCount} digital items ready for secure checkout.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-400/25 px-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
            onClick={clearCart}
          >
            <Trash2 className="size-4" />
            Clear cart
          </button>
        </div>

        {checkoutState === "cancelled" ? (
          <CheckoutReturnHandler mode="cancelled" />
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          <section className="space-y-4">
            {items.map((item) => (
              <CartLineItem key={item.productId} item={item} />
            ))}
          </section>

          <aside className="h-fit rounded-lg border border-white/10 bg-[#071020]/90 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <h2 className="text-xl font-bold text-white">Order summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <SummaryRow label="Subtotal" value={formatMoney(totalCents)} />
              <SummaryRow label="Delivery" value="Instant digital access" />
              <SummaryRow label="Payment" value="Stripe Checkout" />
              <div className="border-t border-white/10 pt-4">
                <SummaryRow
                  emphasized
                  label="Total"
                  value={formatMoney(totalCents)}
                />
              </div>
            </div>

            <div className="mt-5">
              <CheckoutButton disabled={items.length === 0} />
            </div>

            <div className="mt-5 grid gap-3 border-t border-white/10 pt-5">
              <TrustItem
                icon={<LockKeyhole className="size-4" />}
                label="Encrypted checkout"
              />
              <TrustItem
                icon={<BadgeCheck className="size-4" />}
                label="Entitlement-backed downloads"
              />
              <TrustItem
                icon={<RefreshCw className="size-4" />}
                label="Cart remains saved if payment is cancelled"
              />
              <TrustItem
                icon={<ShieldCheck className="size-4" />}
                label="Protected private asset delivery"
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SummaryRow({
  emphasized,
  label,
  value,
}: {
  emphasized?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className={emphasized ? "font-bold text-white" : "text-slate-400"}>
        {label}
      </span>
      <span className={emphasized ? "text-xl font-black text-white" : ""}>
        {value}
      </span>
    </div>
  );
}

function TrustItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <span className="grid size-8 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
        {icon}
      </span>
      {label}
    </div>
  );
}
