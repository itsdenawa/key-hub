import { Search } from "lucide-react";

import type { Category } from "@/shared/types/catalog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";

type CatalogControlsProps = {
  categories: Category[];
  search?: string;
  category?: string;
  sort?: string;
};

export function CatalogControls({
  categories,
  search,
  category,
  sort = "featured",
}: CatalogControlsProps) {
  return (
    <form className="grid gap-3 rounded-lg border border-border bg-card p-3 md:grid-cols-[1fr_180px_180px_auto]">
      <label className="relative" htmlFor="catalog-search">
        <span className="sr-only">Search products</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="catalog-search"
          name="search"
          placeholder="Search digital goods"
          defaultValue={search}
          className="pl-9"
        />
      </label>
      <label htmlFor="catalog-category">
        <span className="sr-only">Category</span>
        <Select
          id="catalog-category"
          name="category"
          defaultValue={category ?? ""}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </Select>
      </label>
      <label htmlFor="catalog-sort">
        <span className="sr-only">Sort</span>
        <Select id="catalog-sort" name="sort" defaultValue={sort}>
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </Select>
      </label>
      <Button type="submit">Apply</Button>
    </form>
  );
}
