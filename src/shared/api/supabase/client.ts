import { createBrowserClient } from "@supabase/ssr";

import { clientEnv, requireEnvValue } from "@/shared/config/env";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    requireEnvValue(
      clientEnv.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL",
    ),
    requireEnvValue(
      clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ),
  );
}
