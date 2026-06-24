import Link from "next/link";

import { getStorefrontProducts } from "@/entities/product/repository";
import { getCurrentUserProfile } from "@/entities/user/session";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasSupabaseBrowserEnv } from "@/shared/config/env";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { AccountNav } from "@/views/account/account-nav";
import { ProductGrid } from "@/widgets/product-grid/product-grid";

export async function WishlistView() {
  const { user } = await getCurrentUserProfile();
  const products = await getWishlistProducts(user?.id);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside>
        <AccountNav section="wishlist" />
      </aside>
      <section className="space-y-5">
        <div>
          <h1 className="text-3xl font-semibold">Wishlist</h1>
          <p className="mt-2 text-muted-foreground">
            Saved products stay attached to your KeyHub account.
          </p>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="font-semibold">No saved products yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Save products from the catalog to compare them later. Wishlist
                storage uses Supabase once auth is configured.
              </p>
              <Link
                href="/products"
                className={buttonVariants({ className: "mt-5" })}
              >
                Browse products
              </Link>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
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
