import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStorefrontProducts } from "@/entities/product/repository";
import { checkoutSchema } from "@/entities/product/schema";
import { createStripeClient } from "@/shared/api/stripe/server";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { siteConfig } from "@/shared/config/site";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Checkout request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid checkout payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in before checkout." },
      { status: 401 },
    );
  }

  let stripe: ReturnType<typeof createStripeClient>;

  try {
    stripe = createStripeClient();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Stripe is not configured for checkout.",
      },
      { status: 500 },
    );
  }

  const products = await getStorefrontProducts();
  const items = parsed.data.items.flatMap((item) => {
    const product = products.find(
      (candidate) => candidate.id === item.productId,
    );

    if (!product || product.status !== "active") {
      return [];
    }

    return {
      product,
      quantity: item.quantity,
    };
  });

  if (items.length !== parsed.data.items.length) {
    return NextResponse.json(
      { error: "One or more cart items are no longer available." },
      { status: 400 },
    );
  }

  const totalCents = items.reduce(
    (total, item) => total + item.product.priceCents * item.quantity,
    0,
  );

  if (totalCents <= 0) {
    return NextResponse.json(
      { error: "Cart total must be greater than zero." },
      { status: 400 },
    );
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_email: user.email,
      total_cents: totalCents,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map(({ product, quantity }) => ({
      order_id: order.id,
      product_id: product.id,
      product_title: product.title,
      quantity,
      unit_amount_cents: product.priceCents,
    })),
  );

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  const lineItems = items.map(({ product, quantity }) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.title,
        description: product.description,
        images: [`${siteConfig.url}${product.imageUrl}`],
      },
      unit_amount: product.priceCents,
    },
    quantity,
  }));

  let session: Stripe.Checkout.Session;

  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      allow_promotion_codes: true,
      client_reference_id: order.id,
      customer_email: user.email,
      metadata: {
        orderId: order.id,
        userId: user.id,
      },
      success_url: `${siteConfig.url}/account/orders?checkout=success`,
      cancel_url: `${siteConfig.url}/cart?checkout=cancelled`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Stripe checkout session could not be created.",
      },
      { status: 502 },
    );
  }

  await supabase
    .from("orders")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", order.id);

  return NextResponse.json({ url: session.url });
}
