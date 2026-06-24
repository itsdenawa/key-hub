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
    <Card className="group overflow-hidden border-white/10 bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-violet-400/50 hover:bg-white/[0.07]">
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden bg-[#0b1020]"
      >
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={720}
          height={540}
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b16]/70 via-transparent to-transparent" />
      </Link>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <Badge className="border-white/10 bg-white/5 text-slate-300">
              {product.categoryName}
            </Badge>
            <div className="space-y-1">
              <Link
                href={`/products/${product.slug}`}
                className="line-clamp-1 font-semibold text-white hover:text-violet-300"
              >
                {product.title}
              </Link>
              <p className="line-clamp-2 text-sm text-slate-400">
                {product.description}
              </p>
            </div>
          </div>
          <WishlistButton productId={product.id} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {product.fileTypes.slice(0, 3).map((type) => (
            <Badge key={type} variant="outline" className="border-white/10">
              {type}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-white">
              {formatMoney(product.priceCents)}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)}
              </span>
              <span className="line-clamp-1 max-w-28">{product.license}</span>
            </div>
          </div>
          <AddToCartButton
            product={product}
            size="icon"
            showLabel={false}
            className="border border-white/10 bg-white/5 text-white hover:bg-violet-500/20"
          />
        </div>
      </CardContent>
    </Card>
  );
}
