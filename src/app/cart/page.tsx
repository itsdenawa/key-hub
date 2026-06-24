import type { Metadata } from "next";

import { CartView } from "@/views/cart/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review KeyHub digital goods before checkout.",
};

export default function CartPage() {
  return <CartView />;
}
