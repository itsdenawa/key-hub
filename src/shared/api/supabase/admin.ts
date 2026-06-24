import { createClient } from "@supabase/supabase-js";

import { requireEnvValue, serverEnv } from "@/shared/config/env";
import type { Database } from "@/shared/types/database";

export function createSupabaseAdminClient() {
  return createClient<Database>(
    requireEnvValue(
      serverEnv.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL",
    ),
    requireEnvValue(
      serverEnv.SUPABASE_SERVICE_ROLE_KEY,
      "SUPABASE_SERVICE_ROLE_KEY",
    ),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
