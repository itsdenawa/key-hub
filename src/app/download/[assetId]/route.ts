import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { serverEnv } from "@/shared/config/env";

type DownloadRouteProps = {
  params: Promise<{
    assetId: string;
  }>;
};

export async function GET(_request: Request, { params }: DownloadRouteProps) {
  const { assetId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to download." },
      { status: 401 },
    );
  }

  const { data: asset, error: assetError } = await supabase
    .from("product_assets")
    .select("id, product_id, storage_path")
    .eq("id", assetId)
    .eq("is_active", true)
    .single();

  if (assetError || !asset) {
    return NextResponse.json({ error: "Asset not found." }, { status: 404 });
  }

  const { data: entitlement } = await supabase
    .from("entitlements")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", asset.product_id)
    .eq("active", true)
    .is("revoked_at", null)
    .maybeSingle();

  if (!entitlement) {
    return NextResponse.json(
      { error: "No active entitlement for this asset." },
      { status: 403 },
    );
  }

  const { data, error } = await supabase.storage
    .from(serverEnv.PRIVATE_PRODUCT_ASSET_BUCKET)
    .createSignedUrl(asset.storage_path, 60 * 10);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: error?.message ?? "Could not create signed URL." },
      { status: 500 },
    );
  }

  return NextResponse.redirect(data.signedUrl);
}
