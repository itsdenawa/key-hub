"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/entities/user/session";
import type { AdminActionState } from "@/features/admin/action-state";
import {
  adminCategorySchema,
  adminProductSchema,
  deleteCategorySchema,
  deleteProductSchema,
  updateOrderStatusSchema,
} from "@/features/admin/schemas";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasSupabaseBrowserEnv } from "@/shared/config/env";

export async function upsertProductAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const adminCheck = await requireAdmin();

  if (!adminCheck.ok) {
    return adminCheck.state;
  }

  const parsed = adminProductSchema.safeParse({
    assetFilename: emptyToUndefined(formData.get("assetFilename")),
    assetSizeMb: formData.get("assetSizeMb"),
    assetStoragePath: emptyToUndefined(formData.get("assetStoragePath")),
    assetVersion: emptyToUndefined(formData.get("assetVersion")),
    categoryId: formData.get("categoryId"),
    delivery: formData.get("delivery"),
    description: formData.get("description"),
    fileTypes: formData.get("fileTypes"),
    id: emptyToUndefined(formData.get("id")),
    imagePath: emptyToUndefined(formData.get("imagePath")),
    license: formData.get("license"),
    longDescription: formData.get("longDescription"),
    priceCents: formData.get("priceCents"),
    rating: formData.get("rating"),
    slug: formData.get("slug"),
    status: formData.get("status"),
    stripePriceId: emptyToUndefined(formData.get("stripePriceId")),
    title: formData.get("title"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check product fields and try again.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const productPayload = {
    category_id: parsed.data.categoryId,
    delivery: parsed.data.delivery,
    description: parsed.data.description,
    file_types: parsed.data.fileTypes,
    license: parsed.data.license,
    long_description: parsed.data.longDescription,
    price_cents: parsed.data.priceCents,
    rating: parsed.data.rating,
    slug: parsed.data.slug,
    status: parsed.data.status,
    stripe_price_id: parsed.data.stripePriceId ?? null,
    title: parsed.data.title,
  };

  const { data: product, error } = parsed.data.id
    ? await supabase
        .from("products")
        .update(productPayload)
        .eq("id", parsed.data.id)
        .select("id")
        .single()
    : await supabase
        .from("products")
        .insert(productPayload)
        .select("id")
        .single();

  if (error || !product) {
    return {
      status: "error",
      message: error?.message ?? "Could not save product.",
    };
  }

  await upsertProductImage(supabase, product.id, parsed.data.imagePath);
  await upsertProductAsset(supabase, product.id, parsed.data);

  revalidateAdminAndStorefront();

  return {
    status: "success",
    message: parsed.data.id ? "Product updated." : "Product created.",
  };
}

export async function archiveProductAction(formData: FormData) {
  if (!(await requireAdmin()).ok) {
    return;
  }

  const parsed = deleteProductSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("products")
    .update({ status: "archived" })
    .eq("id", parsed.data.id);

  revalidateAdminAndStorefront();
}

export async function upsertCategoryAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const adminCheck = await requireAdmin();

  if (!adminCheck.ok) {
    return adminCheck.state;
  }

  const parsed = adminCategorySchema.safeParse({
    description: emptyToUndefined(formData.get("description")),
    id: emptyToUndefined(formData.get("id")),
    imagePath: emptyToUndefined(formData.get("imagePath")),
    isActive: formData.get("isActive") === "on",
    name: formData.get("name"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check category fields and try again.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const payload = {
    description: parsed.data.description ?? "",
    image_path: parsed.data.imagePath ?? null,
    is_active: parsed.data.isActive,
    name: parsed.data.name,
    slug: parsed.data.slug,
    sort_order: parsed.data.sortOrder,
  };
  const { error } = parsed.data.id
    ? await supabase.from("categories").update(payload).eq("id", parsed.data.id)
    : await supabase.from("categories").insert(payload);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateAdminAndStorefront();

  return {
    status: "success",
    message: parsed.data.id ? "Category updated." : "Category created.",
  };
}

export async function deleteCategoryAction(formData: FormData) {
  if (!(await requireAdmin()).ok) {
    return;
  }

  const parsed = deleteCategorySchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  await supabase.from("categories").delete().eq("id", parsed.data.id);

  revalidateAdminAndStorefront();
}

export async function updateOrderStatusAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const adminCheck = await requireAdmin();

  if (!adminCheck.ok) {
    return adminCheck.state;
  }

  const parsed = updateOrderStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Choose a valid order status.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
  revalidatePath("/account/orders");

  return {
    status: "success",
    message: "Order status updated.",
  };
}

type SupabaseServerClient = Awaited<
  ReturnType<typeof createSupabaseServerClient>
>;
type ProductAssetFields = {
  assetFilename?: string;
  assetSizeMb: number;
  assetStoragePath?: string;
  assetVersion: string;
};

async function upsertProductImage(
  supabase: SupabaseServerClient,
  productId: string,
  imagePath?: string,
) {
  if (!imagePath) {
    return;
  }

  const { data: currentImage } = await supabase
    .from("product_images")
    .select("id")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (currentImage) {
    await supabase
      .from("product_images")
      .update({ alt: "Product image", storage_path: imagePath })
      .eq("id", currentImage.id);
    return;
  }

  await supabase.from("product_images").insert({
    alt: "Product image",
    product_id: productId,
    sort_order: 0,
    storage_path: imagePath,
  });
}

async function upsertProductAsset(
  supabase: SupabaseServerClient,
  productId: string,
  fields: ProductAssetFields,
) {
  if (!fields.assetFilename || !fields.assetStoragePath) {
    return;
  }

  const payload = {
    filename: fields.assetFilename,
    is_active: true,
    product_id: productId,
    size_mb: fields.assetSizeMb,
    storage_path: fields.assetStoragePath,
    version: fields.assetVersion,
  };

  await supabase.from("product_assets").upsert(payload, {
    onConflict: "product_id,version",
  });
}

async function requireAdmin() {
  if (!hasSupabaseBrowserEnv()) {
    return {
      ok: false as const,
      state: {
        status: "error" as const,
        message: "Connect Supabase and sign in as admin before saving.",
      },
    };
  }

  const { profile, user } = await getCurrentUserProfile();

  if (!user) {
    redirect("/auth/sign-in?next=/admin/dashboard");
  }

  if (profile?.role !== "admin") {
    return {
      ok: false as const,
      state: {
        status: "error" as const,
        message: "Admin permissions are required.",
      },
    };
  }

  return {
    ok: true as const,
  };
}

function revalidateAdminAndStorefront() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/products");
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  revalidatePath("/", "layout");
}

function emptyToUndefined(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
