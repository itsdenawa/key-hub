import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { clientEnv, requireEnvValue } from "@/shared/config/env";
import type { Database } from "@/shared/types/database";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    requireEnvValue(
      clientEnv.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL",
    ),
    requireEnvValue(
      clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Server Components cannot write cookies; middleware refreshes them.
            }
          }
        },
      },
    },
  );
}
