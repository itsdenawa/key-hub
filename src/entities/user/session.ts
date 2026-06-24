import { cache } from "react";

import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasSupabaseBrowserEnv } from "@/shared/config/env";

export const getCurrentUserProfile = cache(async () => {
  if (!hasSupabaseBrowserEnv()) {
    return {
      profile: null,
      user: null,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      profile: null,
      user: null,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  return {
    profile,
    user,
  };
});
