import {
  ChevronRight,
  Download,
  KeyRound,
  PackageCheck,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { CheckoutReturnHandler } from "@/features/cart/checkout-return-handler";
import { formatMoney } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
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

type OrdersViewProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export async function OrdersView({ searchParams = {} }: OrdersViewProps) {
  const orders = await getAccountOrders();
  const checkoutState = normalizeParam(searchParams.checkout);
  const downloadState = normalizeParam(searchParams.download);

  return (
    <main className="bg-[#050814] text-white">
      <div className="mx-auto w-full max-w-[1440px] space-y-7 px-4 py-8 sm:px-6 lg:px-8 2xl:px-0">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-slate-300">Orders</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside>
            <AccountNav section="orders" />
          </aside>

          <section className="min-w-0 space-y-5">
            <div>
              <h1 className="text-[34px] font-black leading-tight sm:text-[38px]">
                Orders
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Review purchases, fulfillment status, and entitlement-backed
                downloads.
              </p>
            </div>

            {checkoutState === "success" ? (
              <CheckoutReturnHandler mode="success" />
            ) : null}
            {downloadState ? <DownloadNotice state={downloadState} /> : null}

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <EmptyOrders />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

type OrderCardProps = {
  order: AccountOrder;
};

function OrderCard({ order }: OrderCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-[#071020]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <header className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Order</p>
          <h2 className="mt-1 text-xl font-bold text-white">
            {shortOrderId(order.id)}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(order.createdAt))}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      <div className="grid gap-3 border-b border-white/10 p-5 text-sm md:grid-cols-3">
        <Metric label="Items" value={String(order.itemsCount)} />
        <Metric label="Total" value={formatMoney(order.totalCents)} />
        <Metric
          label="Customer"
          value={order.customerEmail ?? "Account email"}
        />
      </div>

      <div className="divide-y divide-white/10">
        {order.items.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </div>
    </article>
  );
}

type OrderItemRowProps = {
  item: AccountOrderItem;
};

function OrderItemRow({ item }: OrderItemRowProps) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-semibold text-white">{item.productTitle}</p>
        <p className="mt-1 text-sm text-slate-400">
          {item.quantity} x {formatMoney(item.unitAmountCents)}
          {item.assetFilename ? ` · ${item.assetFilename}` : ""}
        </p>
      </div>
      {item.entitlementActive && item.assetId ? (
        <Link
          href={`/download/${item.assetId}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-violet-400/45 bg-violet-500/10 text-violet-100 hover:bg-violet-500/20",
          )}
        >
          <Download aria-hidden className="size-4" />
          Download
        </Link>
      ) : (
        <Badge variant="outline" className="border-white/10 text-slate-300">
          Awaiting access
        </Badge>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
      <p className="text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function EmptyOrders() {
  return (
    <section className="rounded-lg border border-white/10 bg-[#071020]/85 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-violet-500/15 text-violet-300">
        <PackageCheck className="size-7" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-white">No orders yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        Completed Stripe checkouts appear here with protected downloads once
        fulfillment creates entitlements.
      </p>
      <Link
        href="/products"
        className={buttonVariants({
          className:
            "mt-5 bg-gradient-to-r from-violet-600 to-blue-500 text-white",
        })}
      >
        Browse products
      </Link>
    </section>
  );
}

function DownloadNotice({ state }: { state: string }) {
  const isMissing = state === "missing";

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-4 text-sm",
        isMissing
          ? "border-amber-400/25 bg-amber-500/10 text-amber-100"
          : "border-red-400/25 bg-red-500/10 text-red-100",
      )}
    >
      {isMissing ? (
        <ShieldAlert className="mt-0.5 size-4 shrink-0" />
      ) : (
        <KeyRound className="mt-0.5 size-4 shrink-0" />
      )}
      {isMissing
        ? "That product asset is no longer available. Contact support if you expected access."
        : "No active entitlement was found for that download. Check the order status or contact support."}
    </div>
  );
}

function OrderStatusBadge({ status }: { status: AccountOrder["status"] }) {
  const isFulfilled = status === "fulfilled" || status === "paid";

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-md border px-3 py-1 text-sm font-bold",
        isFulfilled
          ? "border-emerald-400/25 bg-emerald-500/12 text-emerald-300"
          : "border-blue-400/25 bg-blue-500/12 text-blue-300",
      )}
    >
      {isFulfilled ? (
        <ShieldCheck className="size-4" />
      ) : (
        <PackageCheck className="size-4" />
      )}
      {statusLabels[status]}
    </span>
  );
}

function shortOrderId(id: string) {
  if (id.startsWith("KH-")) {
    return id;
  }

  return `KH-${id.slice(0, 8).toUpperCase()}`;
}

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
