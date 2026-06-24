import { cache } from "react";

import { categories as demoCategories } from "@/entities/category/model";
import { demoOrders } from "@/entities/order/model";
import { products as demoProducts } from "@/entities/product/model";
import { demoProfile } from "@/entities/user/model";
import { getCurrentUserProfile } from "@/entities/user/session";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { clientEnv, hasSupabaseBrowserEnv } from "@/shared/config/env";
import type { Category, Product } from "@/shared/types/catalog";
import type { Tables } from "@/shared/types/database";

export type AdminSection =
  | "dashboard"
  | "products"
  | "categories"
  | "orders"
  | "customers";

export type AdminProduct = Product & {
  categoryId: string | null;
  currency: string;
  imagePath: string;
  stripePriceId: string;
};

export type AdminCategory = Category & {
  imagePath: string;
};

export type AdminOrder = {
  id: string;
  userId: string;
  customerEmail: string;
  status: Tables<"orders">["status"];
  totalCents: number;
  currency: string;
  itemsCount: number;
  createdAt: string;
};

export type AdminCustomer = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  orderCount: number;
  totalSpendCents: number;
  createdAt: string;
};

type ProductRow = Tables<"products"> & {
  categories:
    | Pick<Tables<"categories">, "id" | "name" | "slug">
    | Pick<Tables<"categories">, "id" | "name" | "slug">[]
    | null;
  product_assets: Tables<"product_assets">[];
  product_images: Tables<"product_images">[];
};

export const getAdminContext = cache(async () => {
  const { profile } = await getCurrentUserProfile();

  return {
    canWrite: profile?.role === "admin" && hasSupabaseBrowserEnv(),
    signedInAs: profile?.email ?? null,
  };
});

export const getAdminProducts = cache(async (): Promise<AdminProduct[]> => {
  if (!hasSupabaseBrowserEnv()) {
    return demoProducts.map(mapDemoProduct);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, categories(id, name, slug), product_images(*), product_assets(*)",
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    return demoProducts.map(mapDemoProduct);
  }

  return (data as unknown as ProductRow[]).map(mapProductRow);
});

export const getAdminCategories = cache(async (): Promise<AdminCategory[]> => {
  if (!hasSupabaseBrowserEnv()) {
    return demoCategories.map((category) => ({
      ...category,
      imagePath: category.imageUrl.replace("/products/", ""),
    }));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((category) => ({
    description: category.description,
    id: category.id,
    imagePath: category.image_path ?? "",
    imageUrl: category.image_path
      ? getPublicImageUrl(category.image_path)
      : "/products/design-vault.png",
    isActive: category.is_active,
    name: category.name,
    slug: category.slug,
    sortOrder: category.sort_order,
  }));
});

export const getAdminOrders = cache(async (): Promise<AdminOrder[]> => {
  if (!hasSupabaseBrowserEnv()) {
    return demoOrders.map((order) => ({
      createdAt: order.createdAt,
      currency: "usd",
      customerEmail: demoProfile.email,
      id: order.id,
      itemsCount: order.itemsCount,
      status: order.status,
      totalCents: order.totalCents,
      userId: demoProfile.id,
    }));
  }

  const supabase = await createSupabaseServerClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !orders) {
    return [];
  }

  const orderIds = orders.map((order) => order.id);
  const { data: items } = orderIds.length
    ? await supabase
        .from("order_items")
        .select("order_id, quantity")
        .in("order_id", orderIds)
    : { data: [] };
  const itemCounts = new Map<string, number>();

  for (const item of items ?? []) {
    itemCounts.set(
      item.order_id,
      (itemCounts.get(item.order_id) ?? 0) + item.quantity,
    );
  }

  return orders.map((order) => ({
    createdAt: order.created_at,
    currency: order.currency,
    customerEmail: order.customer_email ?? "Unknown customer",
    id: order.id,
    itemsCount: itemCounts.get(order.id) ?? 0,
    status: order.status,
    totalCents: order.total_cents,
    userId: order.user_id,
  }));
});

export const getAdminCustomers = cache(async (): Promise<AdminCustomer[]> => {
  if (!hasSupabaseBrowserEnv()) {
    return [
      {
        createdAt: "2026-06-20T10:15:00.000Z",
        email: demoProfile.email,
        fullName: demoProfile.fullName,
        id: demoProfile.id,
        orderCount: demoOrders.length,
        role: demoProfile.role,
        totalSpendCents: demoOrders.reduce(
          (total, order) => total + order.totalCents,
          0,
        ),
      },
    ];
  }

  const supabase = await createSupabaseServerClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !profiles) {
    return [];
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("user_id, total_cents");
  const stats = new Map<
    string,
    { orderCount: number; totalSpendCents: number }
  >();

  for (const order of orders ?? []) {
    const current = stats.get(order.user_id) ?? {
      orderCount: 0,
      totalSpendCents: 0,
    };
    current.orderCount += 1;
    current.totalSpendCents += order.total_cents;
    stats.set(order.user_id, current);
  }

  return profiles.map((profile) => {
    const customerStats = stats.get(profile.id) ?? {
      orderCount: 0,
      totalSpendCents: 0,
    };

    return {
      createdAt: profile.created_at,
      email: profile.email,
      fullName: profile.full_name ?? "Unnamed customer",
      id: profile.id,
      orderCount: customerStats.orderCount,
      role: profile.role,
      totalSpendCents: customerStats.totalSpendCents,
    };
  });
});

export const getAdminDashboard = cache(async () => {
  const [products, categories, orders, customers] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
    getAdminOrders(),
    getAdminCustomers(),
  ]);

  return {
    activeProducts: products.filter((product) => product.status === "active")
      .length,
    categoriesCount: categories.length,
    customersCount: customers.length,
    ordersCount: orders.length,
    productsCount: products.length,
    recentOrders: orders.slice(0, 5),
    revenueCents: orders
      .filter((order) => ["paid", "fulfilled"].includes(order.status))
      .reduce((total, order) => total + order.totalCents, 0),
  };
});

function mapDemoProduct(product: Product): AdminProduct {
  return {
    ...product,
    categoryId: null,
    currency: "usd",
    imagePath: product.imageUrl.replace("/products/", ""),
    stripePriceId: "",
  };
}

function mapProductRow(row: ProductRow): AdminProduct {
  const category = Array.isArray(row.categories)
    ? row.categories[0]
    : row.categories;
  const images = [...row.product_images].sort(
    (left, right) => left.sort_order - right.sort_order,
  );
  const imagePath = images[0]?.storage_path ?? "";
  const asset =
    row.product_assets.find((candidate) => candidate.is_active) ??
    row.product_assets[0];

  return {
    asset: {
      filename: asset?.filename ?? `${row.slug}.zip`,
      id: asset?.id ?? row.id,
      productId: row.id,
      sizeMb: asset?.size_mb ?? 0,
      storagePath: asset?.storage_path ?? "",
    },
    categoryId: row.category_id,
    categoryName: category?.name ?? "Uncategorized",
    categorySlug: category?.slug ?? "uncategorized",
    compatibility: row.file_types,
    createdAt: row.created_at,
    currency: row.currency,
    delivery: row.delivery,
    description: row.description,
    fileTypes: row.file_types,
    gallery: images.length
      ? images.map((image) => getPublicImageUrl(image.storage_path))
      : ["/products/design-vault.png"],
    id: row.id,
    imagePath,
    imageUrl: imagePath
      ? getPublicImageUrl(imagePath)
      : "/products/design-vault.png",
    license: row.license,
    longDescription: row.long_description,
    priceCents: row.price_cents,
    rating: row.rating,
    slug: row.slug,
    specs: [
      { label: "Delivery", value: row.delivery },
      { label: "License", value: row.license },
      { label: "Formats", value: row.file_types.join(", ") },
    ],
    status: row.status,
    stripePriceId: row.stripe_price_id ?? "",
    tags: [category?.slug ?? "digital"],
    title: row.title,
  };
}

function getPublicImageUrl(path: string) {
  if (!clientEnv.NEXT_PUBLIC_SUPABASE_URL) {
    return `/products/${path}`;
  }

  return `${clientEnv.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${clientEnv.NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET}/${path}`;
}
