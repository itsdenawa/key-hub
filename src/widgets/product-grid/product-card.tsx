import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { formatMoney } from "@/shared/lib/format";
import type { Product } from "@/shared/types/catalog";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const discount = getDisplayDiscount(product.id);

  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-[#0b1223]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_60px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5 hover:border-violet-400/55 hover:bg-[#101935]/95">
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden border-b border-white/10 bg-[#0a1020]"
      >
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={720}
          height={540}
          className="aspect-[1.12] w-full object-cover transition-transform duration-300 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b16]/80 via-transparent to-transparent" />
        {discount ? (
          <span className="absolute left-2 top-2 rounded-md border border-white/15 bg-gradient-to-r from-violet-600 to-blue-500 px-2 py-1 text-xs font-bold text-white shadow-lg shadow-violet-950/40">
            {discount}
          </span>
        ) : null}
      </Link>
      <div className="space-y-4 p-4">
        <div className="min-w-0 space-y-1.5">
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-1 font-semibold text-white hover:text-violet-300"
          >
            {product.title}
          </Link>
          <p className="line-clamp-1 text-sm text-slate-400">
            {product.categoryName}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-white">
            {formatMoney(product.priceCents)}
          </p>
          <AddToCartButton
            product={product}
            size="icon"
            showLabel={false}
            className="border border-white/10 bg-white/5 text-white hover:bg-violet-500/20"
          />
        </div>
      </div>
    </article>
  );
}

function getDisplayDiscount(id: string) {
  const seed = Number(id.slice(-2));
  const discounts = ["-18%", "", "-20%", "", "-15%", "", "-25%", "-30%"];
  return discounts[seed % discounts.length];
}
