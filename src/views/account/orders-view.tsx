import { Download } from "lucide-react";
import Link from "next/link";

import { formatMoney } from "@/shared/lib/format";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  type AccountOrder,
  type AccountOrderItem,
  getAccountOrders,
} from "@/views/account/account-data";
import { AccountNav } from "@/views/account/account-nav";

const statusLabels: Record<AccountOrder["status"], string> = {
  canceled: "Canceled",
  fulfilled: "Fulfilled",
  paid: "Paid",
  pending: "Pending",
  refunded: "Refunded",
};

export async function OrdersView() {
  const orders = await getAccountOrders();

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside>
        <AccountNav section="orders" />
      </aside>
      <section className="space-y-5">
        <div>
          <h1 className="text-3xl font-semibold">Orders</h1>
          <p className="mt-2 text-muted-foreground">
            Review purchases, fulfillment status, and entitlement-backed
            downloads.
          </p>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="font-semibold">No orders yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Completed Stripe checkouts appear here with protected downloads
                once fulfillment creates entitlements.
              </p>
              <Link
                href="/products"
                className={buttonVariants({ className: "mt-5" })}
              >
                Browse products
              </Link>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}

type OrderCardProps = {
  order: AccountOrder;
};

function OrderCard({ order }: OrderCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>Order {shortOrderId(order.id)}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(order.createdAt))}
          </p>
        </div>
        <Badge variant={order.status === "fulfilled" ? "success" : "outline"}>
          {statusLabels[order.status]}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4 text-sm md:grid-cols-3">
          <div>
            <p className="text-muted-foreground">Items</p>
            <p className="font-medium">{order.itemsCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="font-medium">{formatMoney(order.totalCents)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Customer</p>
            <p className="font-medium">
              {order.customerEmail ?? "Account email"}
            </p>
          </div>
        </div>
        <div className="divide-y divide-border rounded-lg border border-border">
          {order.items.map((item) => (
            <OrderItemRow key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type OrderItemRowProps = {
  item: AccountOrderItem;
};

function OrderItemRow({ item }: OrderItemRowProps) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">{item.productTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {item.quantity} x {formatMoney(item.unitAmountCents)}
          {item.assetFilename ? ` · ${item.assetFilename}` : ""}
        </p>
      </div>
      {item.entitlementActive && item.assetId ? (
        <Link
          href={`/download/${item.assetId}`}
          className={buttonVariants({ variant: "outline" })}
        >
          <Download aria-hidden className="size-4" />
          Download
        </Link>
      ) : (
        <Badge variant="outline">Awaiting access</Badge>
      )}
    </div>
  );
}

function shortOrderId(id: string) {
  if (id.startsWith("KH-")) {
    return id;
  }

  return `KH-${id.slice(0, 8).toUpperCase()}`;
}
