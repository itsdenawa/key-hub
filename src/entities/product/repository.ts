import {
  type CatalogQuery,
  products as demoProducts,
  filterCatalogProducts,
  getCatalogFilters as getDemoCatalogFilters,
  getCatalogProducts as getDemoCatalogProducts,
  getProductBySlug as getDemoProductBySlug,
  getRelatedProducts as getDemoRelatedProducts,
} from "@/entities/product/model";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { clientEnv, hasSupabaseBrowserEnv } from "@/shared/config/env";
import type { Product } from "@/shared/types/catalog";
import type { Tables } from "@/shared/types/database";

type ProductRow = Tables<"products"> & {
  categories:
    | Pick<Tables<"categories">, "name" | "slug">
    | Pick<Tables<"categories">, "name" | "slug">[]
    | null;
  product_assets: Tables<"product_assets">[];
  product_images: Tables<"product_images">[];
};

export async function getStorefrontCatalog(query: CatalogQuery) {
  if (!hasSupabaseBrowserEnv()) {
    return getDemoCatalogProducts(query);
  }

  const products = await getStorefrontProducts();

  if (products.length === 0) {
    return getDemoCatalogProducts(query);
  }

  return filterCatalogProducts(products, query);
}

export async function getStorefrontCatalogFilters() {
  const products = await getStorefrontProducts();

  if (products.length === 0) {
    return getDemoCatalogFilters();
  }

  return getDemoCatalogFilters(products);
}

export async function getStorefrontProductBySlug(slug: string) {
  if (!hasSupabaseBrowserEnv()) {
    return getDemoProductBySlug(slug);
  }

  const products = await getStorefrontProducts();
  return (
    products.find((product) => product.slug === slug) ??
    getDemoProductBySlug(slug)
  );
}

export async function getStorefrontRelatedProducts(product: Product) {
  if (!hasSupabaseBrowserEnv()) {
    return getDemoRelatedProducts(product);
  }

  const products = await getStorefrontProducts();
  const related = products
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.categorySlug === product.categorySlug,
    )
    .slice(0, 3);

  return related.length > 0 ? related : getDemoRelatedProducts(product);
}

export async function getStorefrontProducts() {
  if (!hasSupabaseBrowserEnv()) {
    return demoProducts;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories(name, slug),
      product_images(*),
      product_assets(*)
    `,
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return demoProducts;
  }

  return (data as unknown as ProductRow[]).map(mapProductRow);
}

function mapProductRow(row: ProductRow): Product {
  const category = Array.isArray(row.categories)
    ? row.categories[0]
    : row.categories;
  const imagePath =
    row.product_images.sort(
      (left, right) => left.sort_order - right.sort_order,
    )[0]?.storage_path ?? "design-vault.png";
  const asset =
    row.product_assets.find((item) => item.is_active) ?? row.product_assets[0];

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    categorySlug: category?.slug ?? "uncategorized",
    categoryName: category?.name ?? "Uncategorized",
    description: row.description,
    longDescription: row.long_description,
    imageUrl: `${clientEnv.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${clientEnv.NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET}/${imagePath}`,
    gallery: row.product_images.length
      ? row.product_images
          .sort((left, right) => left.sort_order - right.sort_order)
          .map(
            (image) =>
              `${clientEnv.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${clientEnv.NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET}/${image.storage_path}`,
          )
      : ["/products/design-vault.png"],
    priceCents: row.price_cents,
    rating: row.rating,
    delivery: row.delivery,
    fileTypes: row.file_types,
    license: row.license,
    compatibility: row.file_types,
    specs: [
      { label: "Delivery", value: row.delivery },
      { label: "License", value: row.license },
      { label: "Formats", value: row.file_types.join(", ") },
    ],
    tags: [category?.slug ?? "digital"],
    status: row.status,
    asset: {
      id: asset?.id ?? row.id,
      productId: row.id,
      filename: asset?.filename ?? `${row.slug}.zip`,
      sizeMb: asset?.size_mb ?? 0,
      storagePath: asset?.storage_path ?? `${row.slug}/latest.zip`,
    },
    createdAt: row.created_at,
  };
}
