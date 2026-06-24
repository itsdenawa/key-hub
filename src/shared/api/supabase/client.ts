import { createBrowserClient } from "@supabase/ssr";

import { clientEnv, requireEnvValue } from "@/shared/config/env";
import type { Database } from "@/shared/types/database";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
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
