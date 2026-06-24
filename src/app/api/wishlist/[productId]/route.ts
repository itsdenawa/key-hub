import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasSupabaseBrowserEnv } from "@/shared/config/env";

type WishlistRouteProps = {
  params: Promise<{
    productId: string;
  }>;
};

export async function GET(_request: Request, { params }: WishlistRouteProps) {
  const { productId } = await params;

  if (!hasSupabaseBrowserEnv()) {
    return NextResponse.json({
      authenticated: false,
      productId,
      saved: false,
    });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ saved: false, authenticated: false });
  }

  const { data } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({ saved: Boolean(data), authenticated: true });
}

export async function POST(_request: Request, { params }: WishlistRouteProps) {
  const { productId } = await params;

  if (!hasSupabaseBrowserEnv()) {
    return NextResponse.json(
      { error: "Supabase auth is not configured.", productId },
      { status: 401 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to use wishlist." },
      { status: 401 },
    );
  }

  const { data: existing } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("product_id", productId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saved: false });
  }

  const { error } = await supabase.from("wishlist_items").insert({
    product_id: productId,
    user_id: user.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ saved: true });
}
