import Stripe from "stripe";

import { requireEnvValue, serverEnv } from "@/shared/config/env";

export function createStripeClient() {
  return new Stripe(
    requireEnvValue(serverEnv.STRIPE_SECRET_KEY, "STRIPE_SECRET_KEY"),
  );
}
