"use client";

import Link from "next/link";

import { CartLineItem } from "@/features/cart/cart-line-item";
import { useCartStore } from "@/features/cart/cart-store";
import { CheckoutButton } from "@/features/cart/checkout-button";
import { formatMoney } from "@/shared/lib/format";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const itemsCount = useCartStore((state) => state.getItemsCount());
  const totalCents = useCartStore((state) => state.getTotalCents());

  if (items.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Add a digital kit, template, or starter pack before checkout.
        </p>
        <Link
          href="/products"
          className={buttonVariants({ className: "mt-6" })}
        >
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Cart</h1>
            <p className="mt-2 text-muted-foreground">
              {itemsCount} digital items ready for checkout.
            </p>
          </div>
          <button
            type="button"
            className="text-left text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={clearCart}
          >
            Clear cart
          </button>
        </div>
        <div className="grid gap-4">
          {items.map((item) => (
            <CartLineItem key={item.productId} item={item} />
          ))}
        </div>
      </section>

      <aside>
        <Card>
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatMoney(totalCents)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Delivery</span>
                <span>Instant download</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{formatMoney(totalCents)}</span>
              </div>
            </div>
            <CheckoutButton disabled={items.length === 0} />
            <p className="text-xs text-muted-foreground">
              Checkout requires sign-in so purchases can create entitlements and
              protected downloads.
            </p>
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}
