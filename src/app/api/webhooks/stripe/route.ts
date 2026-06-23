import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createStripeClient } from "@/shared/api/stripe/server";
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
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    requireEnvValue(serverEnv.STRIPE_WEBHOOK_SECRET, "STRIPE_WEBHOOK_SECRET"),
  );

  if (event.type === "checkout.session.completed") {
    // TODO: Mark the order paid/fulfilled and create entitlements in Supabase.
  }

  return NextResponse.json({ received: true });
}
