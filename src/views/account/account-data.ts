import { cache } from "react";

import { demoOrders, type OrderSummary } from "@/entities/order/model";
import { getStorefrontProducts } from "@/entities/product/repository";
import { demoProfile } from "@/entities/user/model";
import { getCurrentUserProfile } from "@/entities/user/session";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasSupabaseBrowserEnv } from "@/shared/config/env";
import type { Product } from "@/shared/types/catalog";
import type { Tables } from "@/shared/types/database";

export type AccountProfileSummary = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isDemo: boolean;
};

export type AddressSummary = {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type AccountOrderItem = {
  id: string;
  productId: string;
  productTitle: string;
  quantity: number;
  unitAmountCents: number;
  totalAmountCents: number;
  assetId?: string;
  assetFilename?: string;
  entitlementActive: boolean;
};

export type AccountOrder = OrderSummary & {
  customerEmail?: string;
  items: AccountOrderItem[];
};

type EntitlementRow = Pick<
  Tables<"entitlements">,
  "active" | "order_item_id" | "product_id" | "revoked_at"
>;

type OrderItemsByOrder = Map<string, Tables<"order_items">[]>;

export const getAccountOverview = cache(async () => {
  const profile = await getAccountProfile();
  const orders = await getAccountOrders();

  return {
    ordersCount: orders.length,
    profile,
    totalSpendCents: orders.reduce(
      (total, order) => total + order.totalCents,
      0,
    ),
  };
});

export const getAccountProfile = cache(
  async (): Promise<AccountProfileSummary> => {
    const { profile, user } = await getCurrentUserProfile();

    if (!user || !profile) {
      return {
        email: demoProfile.email,
        fullName: demoProfile.fullName,
        id: demoProfile.id,
        isDemo: true,
        role: demoProfile.role,
      };
    }

    return {
      email: profile.email || user.email || demoProfile.email,
      fullName: profile.full_name || user.email || demoProfile.fullName,
      id: profile.id,
      isDemo: false,
      role: profile.role,
    };
  },
);

export const getAccountAddresses = cache(
  async (): Promise<AddressSummary[]> => {
    const { user } = await getCurrentUserProfile();

    if (!user || !hasSupabaseBrowserEnv()) {
      return [];
    }

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    return (
      data?.map((address) => ({
        city: address.city,
        country: address.country,
        fullName: address.full_name,
        id: address.id,
        isDefault: address.is_default,
        label: address.label,
        line1: address.line1,
        line2: address.line2 ?? "",
        postalCode: address.postal_code,
        region: address.region ?? "",
      })) ?? []
    );
  },
);

export const getAccountOrders = cache(async (): Promise<AccountOrder[]> => {
  const { user } = await getCurrentUserProfile();

  if (!user || !hasSupabaseBrowserEnv()) {
    return getDemoAccountOrders();
  }

  const supabase = await createSupabaseServerClient();
  const { data: rows, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !rows) {
    return [];
  }

  const orderIds = rows.map((row) => row.id);
  const { data: orderItems } = orderIds.length
    ? await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds)
        .order("created_at", { ascending: true })
    : { data: [] };
  const itemRows = orderItems ?? [];
  const orderItemIds = itemRows.map((item) => item.id);

  const { data: entitlements } = orderItemIds.length
    ? await supabase
        .from("entitlements")
        .select("active, order_item_id, product_id, revoked_at")
        .eq("user_id", user.id)
        .in("order_item_id", orderItemIds)
    : { data: [] };

  const products = await getStorefrontProducts();
  const itemsByOrder = groupItemsByOrder(itemRows);

  return rows.map((row) =>
    mapOrderRow(row, itemsByOrder, products, entitlements ?? []),
  );
});

function getDemoAccountOrders(): AccountOrder[] {
  const products = new Map(
    demoOrders.map((order, index) => {
      const product = index === 0 ? "Launch Kit Pro" : "Design Vault";
      return [order.id, product];
    }),
  );

  return demoOrders.map((order) => ({
    ...order,
    customerEmail: demoProfile.email,
    items: [
      {
        entitlementActive: order.status === "fulfilled",
        id: `${order.id}-item`,
        productId: order.id,
        productTitle: products.get(order.id) ?? "KeyHub product",
        quantity: order.itemsCount,
        totalAmountCents: order.totalCents,
        unitAmountCents: order.totalCents / order.itemsCount,
      },
    ],
  }));
}

function mapOrderRow(
  row: Tables<"orders">,
  itemsByOrder: OrderItemsByOrder,
  products: Product[],
  entitlements: EntitlementRow[],
): AccountOrder {
  const orderItems = itemsByOrder.get(row.id) ?? [];

  return {
    createdAt: row.created_at,
    customerEmail: row.customer_email ?? undefined,
    id: row.id,
    items: orderItems.map((item) => mapOrderItem(item, products, entitlements)),
    itemsCount: orderItems.reduce((total, item) => total + item.quantity, 0),
    status: row.status,
    totalCents: row.total_cents,
  };
}

function groupItemsByOrder(items: Tables<"order_items">[]): OrderItemsByOrder {
  return items.reduce<OrderItemsByOrder>((groups, item) => {
    const currentItems = groups.get(item.order_id) ?? [];
    currentItems.push(item);
    groups.set(item.order_id, currentItems);

    return groups;
  }, new Map());
}

function mapOrderItem(
  item: Tables<"order_items">,
  products: Product[],
  entitlements: EntitlementRow[],
): AccountOrderItem {
  const entitlement = entitlements.find(
    (candidate) => candidate.order_item_id === item.id,
  );
  const product = products.find(
    (candidate) => candidate.id === item.product_id,
  );

  return {
    assetFilename: product?.asset.filename,
    assetId: product?.asset.id,
    entitlementActive: Boolean(
      entitlement?.active && entitlement.revoked_at === null,
    ),
    id: item.id,
    productId: item.product_id,
    productTitle: item.product_title,
    quantity: item.quantity,
    totalAmountCents: item.total_amount_cents,
    unitAmountCents: item.unit_amount_cents,
  };
}
