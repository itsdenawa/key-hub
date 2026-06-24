import { Search } from "lucide-react";
import Link from "next/link";

import { cn } from "@/shared/lib/utils";
import type { Category } from "@/shared/types/catalog";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";

type CatalogControlsProps = {
  categories: Category[];
  fileTypes: string[];
  licenses: string[];
  search?: string;
  category?: string;
  fileType?: string;
  license?: string;
  price?: string;
  sort?: string;
};

export function CatalogControls({
  categories,
  fileTypes,
  licenses,
  search,
  category,
  fileType,
  license,
  price = "all",
  sort = "featured",
}: CatalogControlsProps) {
  return (
    <form className="grid gap-3 rounded-lg border border-border bg-card p-3 lg:grid-cols-[1fr_160px_150px_190px_130px_160px_auto_auto]">
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
      <label htmlFor="catalog-file-type">
        <span className="sr-only">File type</span>
        <Select
          id="catalog-file-type"
          name="fileType"
          defaultValue={fileType ?? ""}
        >
          <option value="">Any format</option>
          {fileTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </label>
      <label htmlFor="catalog-license">
        <span className="sr-only">License</span>
        <Select
          id="catalog-license"
          name="license"
          defaultValue={license ?? ""}
        >
          <option value="">Any license</option>
          {licenses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </label>
      <label htmlFor="catalog-price">
        <span className="sr-only">Price</span>
        <Select id="catalog-price" name="price" defaultValue={price}>
          <option value="all">Any price</option>
          <option value="under-50">Under $50</option>
          <option value="50-75">$50 to $75</option>
          <option value="75-plus">$75+</option>
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
      <Link
        href="/products"
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Reset
      </Link>
    </form>
  );
}
