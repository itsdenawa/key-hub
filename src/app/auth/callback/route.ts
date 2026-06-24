import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/shared/api/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/account/orders";

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(safeNextPath(next), requestUrl.origin));
}

function safeNextPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/account/orders";
  }

  return value;
}
