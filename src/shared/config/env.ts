import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET: z.string().default("product-images"),
});

const serverEnvSchema = clientEnvSchema.extend({
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  PRIVATE_PRODUCT_ASSET_BUCKET: z.string().default("product-assets"),
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET:
    process.env.NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET,
});

export const serverEnv = serverEnvSchema.parse({
  ...clientEnv,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  PRIVATE_PRODUCT_ASSET_BUCKET: process.env.PRIVATE_PRODUCT_ASSET_BUCKET,
});

export function requireEnvValue(value: string | undefined, label: string) {
  if (!value) {
    throw new Error(`${label} is required for this integration.`);
  }

  return value;
}

export function hasSupabaseBrowserEnv() {
  return Boolean(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL &&
      clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
