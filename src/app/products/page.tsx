import type { Metadata } from "next";
import Link from "next/link";

import { getStorefrontCategories } from "@/entities/category/repository";
import {
  getStorefrontCatalog,
  getStorefrontCatalogFilters,
} from "@/entities/product/repository";
import { catalogSearchSchema } from "@/entities/product/schema";
import { buildCatalogHref } from "@/entities/product/url";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { CatalogControls } from "@/widgets/catalog-controls/catalog-controls";
import { ProductGrid } from "@/widgets/product-grid/product-grid";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse premium KeyHub digital goods.",
};

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const query = catalogSearchSchema.parse({
    search: normalizeParam(params.search),
    category: normalizeParam(params.category),
    fileType: normalizeParam(params.fileType),
    license: normalizeParam(params.license),
    price: normalizeParam(params.price),
    sort: normalizeParam(params.sort),
    page: normalizeParam(params.page),
  });
  const [categories, filters, catalog] = await Promise.all([
    getStorefrontCategories(),
    getStorefrontCatalogFilters(),
    getStorefrontCatalog(query),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Products</h1>
          <p className="mt-2 text-muted-foreground">
            Browse KeyHub templates, systems, and digital toolkits.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {catalog.total} products found
        </p>
      </div>
      <CatalogControls
        categories={categories}
        fileTypes={filters.fileTypes}
        licenses={filters.licenses}
        search={query.search}
        category={query.category}
        fileType={query.fileType}
        license={query.license}
        price={query.price}
        sort={query.sort}
      />
      <ProductGrid products={catalog.products} />
      <div className="flex items-center justify-between">
        <Link
          href={buildCatalogHref(query, { page: catalog.page - 1 })}
          aria-disabled={catalog.page <= 1}
          className={cn(
            buttonVariants({ variant: "outline" }),
            catalog.page <= 1 && "pointer-events-none opacity-50",
          )}
        >
          Previous
        </Link>
        <p className="text-sm text-muted-foreground">
          Page {catalog.page} of {catalog.totalPages}
        </p>
        <Link
          href={buildCatalogHref(query, { page: catalog.page + 1 })}
          aria-disabled={catalog.page >= catalog.totalPages}
          className={cn(
            buttonVariants({ variant: "outline" }),
            catalog.page >= catalog.totalPages &&
              "pointer-events-none opacity-50",
          )}
        >
          Next
        </Link>
      </div>
    </main>
  );
}

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
