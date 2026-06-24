import { ArrowRight, Download, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { getStorefrontCategories } from "@/entities/category/repository";
import { getStorefrontProducts } from "@/entities/product/repository";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { ProductGrid } from "@/widgets/product-grid/product-grid";

export async function HomeView() {
  const [categories, products] = await Promise.all([
    getStorefrontCategories(),
    getStorefrontProducts(),
  ]);
  const featuredProducts = products.slice(0, 3);

  return (
    <main>
      <section className="border-b border-border bg-muted/25">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-20">
          <div className="flex max-w-3xl flex-col justify-center gap-6">
            <Badge variant="success">Digital delivery for builders</Badge>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                KeyHub
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Premium digital products for people who ship: launch kits,
                design systems, automation packs, and developer templates with
                protected downloads after purchase.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Browse catalog
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link
                href="/account/orders"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                )}
              >
                View downloads
              </Link>
            </div>
          </div>
          <div className="grid gap-3">
            {[
              {
                icon: LockKeyhole,
                title: "Authenticated checkout",
                body: "Orders and entitlements are tied to Supabase user sessions.",
              },
              {
                icon: Download,
                title: "Private asset delivery",
                body: "Purchased files are exposed through entitlement-checked signed URLs.",
              },
              {
                icon: ShieldCheck,
                title: "Admin-ready catalog",
                body: "Products, categories, orders, and customers already have route surfaces.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="flex gap-4 p-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Featured products
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Start with proven digital kits
            </h2>
          </div>
          <Link
            href="/products"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            All products
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      <section className="border-t border-border bg-muted/25">
        <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          {categories.map((category) => (
            <Card key={category.slug}>
              <CardContent className="p-5">
                <h3 className="font-semibold">{category.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {category.description}
                </p>
                <Link
                  href={`/products?category=${category.slug}`}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "mt-4",
                    }),
                  )}
                >
                  Explore
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
