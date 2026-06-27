import { ChevronRight, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

import { getStorefrontProducts } from "@/entities/product/repository";
import { getCurrentUserProfile } from "@/entities/user/session";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasSupabaseBrowserEnv } from "@/shared/config/env";
import { buttonVariants } from "@/shared/ui/button";
import { AccountNav } from "@/views/account/account-nav";
import { ProductGrid } from "@/widgets/product-grid/product-grid";

export async function WishlistView() {
  const { user } = await getCurrentUserProfile();
  const products = await getWishlistProducts(user?.id);

  return (
    <main className="bg-[#050814] text-white">
      <div className="mx-auto w-full max-w-[1440px] space-y-7 px-4 py-8 sm:px-6 lg:px-8 2xl:px-0">
        <Breadcrumb />

        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside>
            <AccountNav section="wishlist" />
          </aside>

          <section className="min-w-0 space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-[34px] font-black leading-tight sm:text-[38px]">
                  Wishlist
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  Saved products stay attached to your KeyHub account.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-slate-300">
                <span className="font-bold text-white">{products.length}</span>{" "}
                saved products
              </div>
            </div>

            {products.length > 0 ? (
              <section className="rounded-lg border border-white/10 bg-[#071020]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <ProductGrid products={products} />
              </section>
            ) : (
              <EmptyWishlist />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500">
      <Link href="/" className="hover:text-white">
        Home
      </Link>
      <ChevronRight className="size-4" />
      <span className="text-slate-300">Wishlist</span>
    </nav>
  );
}

function EmptyWishlist() {
  return (
    <section className="rounded-lg border border-white/10 bg-[#071020]/85 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-violet-400/30 bg-violet-500/15 text-violet-200">
        <Heart className="size-8" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-white">
        No saved products yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        Save products from the catalog to compare them later. Wishlist storage
        uses Supabase once auth is configured.
      </p>
      <Link
        href="/products"
        className={buttonVariants({
          className:
            "mt-5 bg-gradient-to-r from-violet-600 to-blue-500 text-white",
        })}
      >
        <Sparkles className="size-4" />
        Browse products
      </Link>
    </section>
  );
}

async function getWishlistProducts(userId?: string) {
  if (!userId || !hasSupabaseBrowserEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("user_id", userId);

  if (!data?.length) {
    return [];
  }

  const savedIds = new Set(data.map((item) => item.product_id));
  const products = await getStorefrontProducts();

  return products.filter((product) => savedIds.has(product.id));
}
