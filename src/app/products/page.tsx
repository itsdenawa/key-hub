import {
  ChevronRight,
  Gamepad2,
  Grid3X3,
  Headphones,
  KeyRound,
  Layers3,
  List,
  Music,
  Package,
  Palette,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";

import { getStorefrontCategories } from "@/entities/category/repository";
import {
  getStorefrontCatalog,
  getStorefrontCatalogFilters,
  getStorefrontProducts,
} from "@/entities/product/repository";
import { catalogSearchSchema } from "@/entities/product/schema";
import { buildCatalogHref } from "@/entities/product/url";
import { cn } from "@/shared/lib/utils";
import type { Category, PriceRange, Product } from "@/shared/types/catalog";
import { buttonVariants } from "@/shared/ui/button";
import { ProductGrid } from "@/widgets/product-grid/product-grid";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse premium KeyHub digital goods.",
};

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type CatalogIcon = ComponentType<{ className?: string }>;

const priceOptions: Array<{
  count: number;
  label: string;
  value: PriceRange;
}> = [
  { count: 12, label: "All prices", value: "all" },
  { count: 10, label: "Under $50", value: "under-50" },
  { count: 1, label: "$50 to $75", value: "50-75" },
  { count: 1, label: "$75+", value: "75-plus" },
];

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
  const [categories, filters, allProducts, catalog] = await Promise.all([
    getStorefrontCategories(),
    getStorefrontCatalogFilters(),
    getStorefrontProducts(),
    getStorefrontCatalog(query),
  ]);
  const categoryCounts = getCategoryCounts(allProducts);

  return (
    <main className="bg-[#050814] text-white">
      <div className="mx-auto w-full max-w-[1440px] space-y-7 px-4 py-8 sm:px-6 lg:px-8 2xl:px-0">
        <Breadcrumb />

        <section className="space-y-5">
          <div>
            <h1 className="text-[34px] font-black leading-tight sm:text-[38px]">
              Catalog of digital goods
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Find games, software, subscriptions, keys, templates, courses, and
              creative tools with instant delivery.
            </p>
          </div>

          <CategoryTabs categories={categories} query={query} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[286px_1fr]">
          <CatalogFilters
            categories={categories}
            categoryCounts={categoryCounts}
            fileTypes={filters.fileTypes}
            products={allProducts}
            query={query}
          />

          <div className="rounded-lg border border-white/10 bg-[#071020]/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-5">
            <div className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-slate-400">
                Found products:{" "}
                <span className="font-semibold text-white">
                  {catalog.total.toLocaleString("en-US")}
                </span>
              </p>
              <div className="flex items-center gap-3">
                <SortForm query={query} />
                <div className="flex rounded-lg border border-white/10 bg-white/[0.04] p-1">
                  <button
                    type="button"
                    className="grid size-9 place-items-center rounded-md bg-gradient-to-br from-violet-600 to-blue-500 text-white"
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="grid size-9 place-items-center rounded-md text-slate-400 hover:text-white"
                    aria-label="List view"
                  >
                    <List className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            <ProductGrid products={catalog.products} />

            <CatalogPagination
              page={catalog.page}
              query={query}
              totalPages={catalog.totalPages}
            />
          </div>
        </section>
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
      <span className="text-slate-300">Catalog</span>
    </nav>
  );
}

function CategoryTabs({
  categories,
  query,
}: {
  categories: Category[];
  query: ReturnType<typeof catalogSearchSchema.parse>;
}) {
  const allTabs = [
    {
      href: buildCatalogHref(query, { category: undefined, page: 1 }),
      icon: Sparkles,
      isActive: !query.category,
      label: "Popular",
    },
    ...categories.map((category) => ({
      href: buildCatalogHref(query, { category: category.slug, page: 1 }),
      icon: getCategoryIcon(category.slug),
      isActive: query.category === category.slug,
      label: category.name,
    })),
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0a1223]/85 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex min-w-max items-center gap-2">
        {allTabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "flex h-11 min-w-[122px] items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition",
                tab.isActive
                  ? "border-violet-400/45 bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-950/35"
                  : "border-white/10 bg-white/[0.025] text-slate-300 hover:border-violet-400/35 hover:text-white",
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function CatalogFilters({
  categories,
  categoryCounts,
  fileTypes,
  products,
  query,
}: {
  categories: Category[];
  categoryCounts: Map<string, number>;
  fileTypes: string[];
  products: Product[];
  query: ReturnType<typeof catalogSearchSchema.parse>;
}) {
  return (
    <aside className="h-fit overflow-hidden rounded-lg border border-white/10 bg-[#071020]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white">Filters</h2>
          <SlidersHorizontal className="size-4 text-violet-300" />
        </div>
      </div>

      <FilterSection title="Categories">
        <FilterLink
          active={!query.category}
          count={products.length}
          href={buildCatalogHref(query, { category: undefined, page: 1 })}
          label="All categories"
        />
        {categories.map((category) => (
          <FilterLink
            key={category.slug}
            active={query.category === category.slug}
            count={categoryCounts.get(category.slug) ?? 0}
            href={buildCatalogHref(query, {
              category: category.slug,
              page: 1,
            })}
            label={category.name}
          />
        ))}
      </FilterSection>

      <FilterSection title="Price">
        {priceOptions.map((option) => (
          <FilterLink
            key={option.value}
            active={query.price === option.value}
            count={option.count}
            href={buildCatalogHref(query, { page: 1, price: option.value })}
            label={option.label}
          />
        ))}
      </FilterSection>

      <FilterSection title="Product type">
        {fileTypes.slice(0, 6).map((type) => (
          <FilterLink
            key={type}
            active={query.fileType === type}
            count={getFileTypeCount(products, type)}
            href={buildCatalogHref(query, { fileType: type, page: 1 })}
            label={formatFacetLabel(type)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Discount">
        {[
          "Any deal",
          "Only discounted",
          "20% and higher",
          "30% and higher",
        ].map((label, index) => (
          <FilterCheckbox
            key={label}
            count={[12, 6, 4, 2][index]}
            label={label}
          />
        ))}
      </FilterSection>

      <div className="border-t border-white/10 p-5">
        <Link
          href="/products"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 w-full border-white/10 bg-white/[0.035] text-slate-200 hover:bg-white/[0.075]",
          )}
        >
          <RefreshCw className="size-4" />
          Reset filters
        </Link>
      </div>
    </aside>
  );
}

function FilterSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="space-y-3 border-b border-white/10 p-5">
      <h3 className="font-semibold text-white">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function FilterLink({
  active,
  count,
  href,
  label,
}: {
  active: boolean;
  count: number;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-4 text-sm text-slate-400 transition hover:text-white"
    >
      <span className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            "grid size-4 shrink-0 place-items-center rounded-full border",
            active ? "border-violet-400" : "border-slate-600",
          )}
        >
          {active ? (
            <span className="size-2 rounded-full bg-violet-400" />
          ) : null}
        </span>
        <span className={cn(active && "font-semibold text-white")}>
          {label}
        </span>
      </span>
      <span className="text-xs text-slate-500">{count}</span>
    </Link>
  );
}

function FilterCheckbox({ count, label }: { count: number; label: string }) {
  return (
    <label className="flex items-center justify-between gap-4 text-sm text-slate-400">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          className="size-4 rounded border-white/15 bg-transparent accent-violet-500"
        />
        {label}
      </span>
      <span className="text-xs text-slate-500">{count}</span>
    </label>
  );
}

function SortForm({
  query,
}: {
  query: ReturnType<typeof catalogSearchSchema.parse>;
}) {
  return (
    <form action="/products" className="flex items-center gap-2">
      <input type="hidden" name="category" value={query.category ?? ""} />
      <input type="hidden" name="fileType" value={query.fileType ?? ""} />
      <input type="hidden" name="price" value={query.price ?? "all"} />
      <label className="sr-only" htmlFor="catalog-sort">
        Sort products
      </label>
      <select
        id="catalog-sort"
        name="sort"
        defaultValue={query.sort}
        className="h-10 rounded-lg border border-white/10 bg-[#0b1325] px-3 text-sm font-semibold text-white outline-none ring-violet-400/40 transition focus:ring-2"
      >
        <option value="featured">Popular</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
      <button
        type="submit"
        className="h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.08]"
      >
        Apply
      </button>
    </form>
  );
}

function CatalogPagination({
  page,
  query,
  totalPages,
}: {
  page: number;
  query: ReturnType<typeof catalogSearchSchema.parse>;
  totalPages: number;
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
      <Link
        href={buildCatalogHref(query, { page: page - 1 })}
        aria-disabled={page <= 1}
        className={cn(
          paginationButtonClass,
          page <= 1 && "pointer-events-none opacity-45",
        )}
      >
        Prev
      </Link>
      {pages.map((item) => (
        <Link
          key={item}
          href={buildCatalogHref(query, { page: item })}
          className={cn(
            paginationButtonClass,
            item === page &&
              "border-violet-400/60 bg-gradient-to-br from-violet-600 to-blue-500 text-white",
          )}
        >
          {item}
        </Link>
      ))}
      <Link
        href={buildCatalogHref(query, { page: page + 1 })}
        aria-disabled={page >= totalPages}
        className={cn(
          paginationButtonClass,
          page >= totalPages && "pointer-events-none opacity-45",
        )}
      >
        Next
      </Link>
    </div>
  );
}

const paginationButtonClass =
  "grid h-10 min-w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.035] px-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.075] hover:text-white";

function getCategoryCounts(products: Product[]) {
  return products.reduce((counts, product) => {
    counts.set(
      product.categorySlug,
      (counts.get(product.categorySlug) ?? 0) + 1,
    );
    return counts;
  }, new Map<string, number>());
}

function getFileTypeCount(products: Product[], fileType: string) {
  return products.filter((product) => product.fileTypes.includes(fileType))
    .length;
}

function formatFacetLabel(value: string) {
  return value
    .toLowerCase()
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getCategoryIcon(slug: string): CatalogIcon {
  const icons: Record<string, CatalogIcon> = {
    audio: Music,
    courses: Package,
    games: Gamepad2,
    graphics: Palette,
    keys: KeyRound,
    software: Layers3,
    subscriptions: Headphones,
    templates: Grid3X3,
  };

  return icons[slug] ?? Package;
}

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
