import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { formatMoney } from "@/shared/lib/format";
import type { Product } from "@/shared/types/catalog";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden">
      <Link
        href={`/products/${product.slug}`}
        className="block overflow-hidden bg-muted"
      >
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={720}
          height={540}
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <Badge variant="secondary">{product.categoryName}</Badge>
            <div className="space-y-1">
              <Link
                href={`/products/${product.slug}`}
                className="line-clamp-1 font-semibold hover:underline"
              >
                {product.title}
              </Link>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {product.description}
              </p>
            </div>
          </div>
          <WishlistButton productId={product.id} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {product.fileTypes.slice(0, 3).map((type) => (
            <Badge key={type} variant="outline">
              {type}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold">{formatMoney(product.priceCents)}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)}
              </span>
              <span>{product.license}</span>
            </div>
          </div>
          <AddToCartButton product={product} size="sm" />
        </div>
      </CardContent>
    </Card>
  );
}
