import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { createStripeClient } from "@/shared/api/stripe/server";
import { createSupabaseAdminClient } from "@/shared/api/supabase/admin";
import { requireEnvValue, serverEnv } from "@/shared/config/env";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  const stripe = createStripeClient();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      requireEnvValue(serverEnv.STRIPE_WEBHOOK_SECRET, "STRIPE_WEBHOOK_SECRET"),
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invalid Stripe webhook signature",
      },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    await fulfillCheckoutSession(event.data.object);
  }

  return NextResponse.json({ received: true });
}

async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId ?? session.client_reference_id;
  const userId = session.metadata?.userId;

  if (!orderId || !userId) {
    throw new Error("Stripe session is missing order metadata.");
  }

  const supabase = createSupabaseAdminClient();

  const { error: orderError } = await supabase
    .from("orders")
    .update({
      status: "fulfilled",
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
    })
    .eq("id", orderId)
    .eq("user_id", userId);

  if (orderError) {
    throw orderError;
  }

  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("id, product_id")
    .eq("order_id", orderId);

  if (itemsError) {
    throw itemsError;
  }

  if (!orderItems?.length) {
    return;
  }

  const { error: entitlementError } = await supabase
    .from("entitlements")
    .upsert(
      orderItems.map((item) => ({
        active: true,
        order_item_id: item.id,
        product_id: item.product_id,
        revoked_at: null,
        user_id: userId,
      })),
      {
        onConflict: "user_id,product_id,order_item_id",
      },
    );

  if (entitlementError) {
    throw entitlementError;
  }
}
