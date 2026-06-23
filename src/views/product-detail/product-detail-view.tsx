import { Download, FileArchive, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { formatMoney } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import type { Product } from "@/shared/types/catalog";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { ProductGrid } from "@/widgets/product-grid/product-grid";

type ProductDetailViewProps = {
  product: Product;
  relatedProducts: Product[];
};

export function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-4">
          <Image
            src={product.imageUrl}
            alt={product.title}
            width={960}
            height={720}
            priority
            className="aspect-[4/3] w-full rounded-lg border border-border object-cover"
          />
          <div className="grid grid-cols-2 gap-4">
            {product.gallery.map((image) => (
              <Image
                key={image}
                src={image}
                alt={`${product.title} preview`}
                width={480}
                height={360}
                className="aspect-[4/3] rounded-lg border border-border object-cover"
              />
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="space-y-3">
            <Badge variant="secondary">{product.categoryName}</Badge>
            <h1 className="text-3xl font-semibold leading-tight">
              {product.title}
            </h1>
            <p className="text-muted-foreground">{product.longDescription}</p>
          </div>
          <Card>
            <CardContent className="space-y-5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-3xl font-semibold">
                    {formatMoney(product.priceCents)}
                  </p>
                </div>
                <WishlistButton productId={product.id} />
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Download className="size-4 text-muted-foreground" />
                  {product.delivery}
                </div>
                <div className="flex items-center gap-2">
                  <FileArchive className="size-4 text-muted-foreground" />
                  {product.asset.filename} · {product.asset.sizeMb} MB
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-muted-foreground" />
                  {product.license}
                </div>
              </div>
              <Separator />
              <AddToCartButton product={product} size="lg" className="w-full" />
              <Link
                href="/auth/sign-in"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-full",
                  }),
                )}
              >
                Sign in to checkout
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold">Included formats</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.fileTypes.map((type) => (
                  <Badge key={type} variant="outline">
                    {type}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      <section className="py-12">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">
            Related products
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Keep building</h2>
        </div>
        <ProductGrid products={relatedProducts} />
      </section>
    </main>
  );
}
