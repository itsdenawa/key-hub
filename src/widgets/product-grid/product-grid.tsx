import type { Product } from "@/shared/types/catalog";
import { ProductCard } from "@/widgets/product-grid/product-card";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <h2 className="font-semibold">No products found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Try another search, category, or sort option.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
