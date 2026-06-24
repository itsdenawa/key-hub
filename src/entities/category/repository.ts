import { categories as demoCategories } from "@/entities/category/model";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { clientEnv, hasSupabaseBrowserEnv } from "@/shared/config/env";
import type { Category } from "@/shared/types/catalog";
import type { Tables } from "@/shared/types/database";

export async function getStorefrontCategories(): Promise<Category[]> {
  if (!hasSupabaseBrowserEnv()) {
    return demoCategories;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return demoCategories;
  }

  return data.map(mapCategoryRow);
}

function mapCategoryRow(row: Tables<"categories">): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: row.image_path
      ? `${clientEnv.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${clientEnv.NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET}/${row.image_path}`
      : "/products/design-vault.png",
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}
