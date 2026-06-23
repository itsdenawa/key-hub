import { NextResponse } from "next/server";

type DownloadRouteProps = {
  params: Promise<{
    assetId: string;
  }>;
};

export async function GET(_request: Request, { params }: DownloadRouteProps) {
  const { assetId } = await params;

  return NextResponse.json(
    {
      assetId,
      error:
        "Protected downloads require Supabase auth, entitlement lookup, and signed storage URLs.",
    },
    { status: 501 },
  );
}
