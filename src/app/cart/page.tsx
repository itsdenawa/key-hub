import type { Metadata } from "next";

import { CartView } from "@/views/cart/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review KeyHub digital goods before checkout.",
};

type CartPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CartPage({ searchParams }: CartPageProps) {
  const params = await searchParams;
  const checkoutState = Array.isArray(params.checkout)
    ? params.checkout[0]
    : params.checkout;

  return <CartView checkoutState={checkoutState} />;
}
