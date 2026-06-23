import { NextResponse } from "next/server";

import { getProductById } from "@/entities/product/model";
import { checkoutSchema } from "@/entities/product/schema";
import { createStripeClient } from "@/shared/api/stripe/server";
import { siteConfig } from "@/shared/config/site";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid checkout payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const lineItems = parsed.data.items.map((item) => {
    const product = getProductById(item.productId);

    if (!product) {
      throw new Error(`Product ${item.productId} was not found.`);
    }

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
          description: product.description,
          images: [`${siteConfig.url}${product.imageUrl}`],
        },
        unit_amount: product.priceCents,
      },
      quantity: item.quantity,
    };
  });

  const stripe = createStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${siteConfig.url}/account/orders?checkout=success`,
    cancel_url: `${siteConfig.url}/products?checkout=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
