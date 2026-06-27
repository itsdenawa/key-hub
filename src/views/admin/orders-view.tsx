import {
  CheckCircle2,
  CreditCard,
  RefreshCw,
  Search,
  ShoppingCart,
} from "lucide-react";
import type { ReactNode } from "react";

import { OrderStatusForm } from "@/features/admin/order-status-form";
import { formatMoney } from "@/shared/lib/format";
import { getAdminContext, getAdminOrders } from "@/views/admin/admin-data";
import { AdminLayout } from "@/views/admin/admin-layout";
import {
  AdminEmptyState,
  AdminPanel,
  AdminStatusBadge,
  formatAdminDate,
} from "@/views/admin/admin-ui";

type AdminOrdersViewProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export async function AdminOrdersView({
  searchParams = {},
}: AdminOrdersViewProps) {
  const [context, orders] = await Promise.all([
    getAdminContext(),
    getAdminOrders(),
  ]);
  const statusFilter = normalizeParam(searchParams.status);
  const search = normalizeParam(searchParams.search)?.trim().toLowerCase();
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      !statusFilter || statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      !search ||
      order.id.toLowerCase().includes(search) ||
      order.customerEmail.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });
  const paidRevenue = orders
    .filter((order) => ["paid", "fulfilled"].includes(order.status))
    .reduce((total, order) => total + order.totalCents, 0);

  return (
    <AdminLayout
      description="Inspect payment state, fulfillment, and customer entitlements."
      section="orders"
      title="Orders"
    >
      <div className="grid gap-5 md:grid-cols-3">
        <OrderMetric
          detail="All checkout attempts"
          icon={<ShoppingCart className="size-5" />}
          label="Orders"
          value={orders.length.toLocaleString("en-US")}
        />
        <OrderMetric
          detail="Paid or fulfilled"
          icon={<CreditCard className="size-5" />}
          label="Revenue"
          value={formatMoney(paidRevenue)}
        />
        <OrderMetric
          detail="Ready for entitlement review"
          icon={<CheckCircle2 className="size-5" />}
          label="Fulfilled"
          value={orders
            .filter((order) => order.status === "fulfilled")
            .length.toLocaleString("en-US")}
        />
      </div>

      <AdminPanel
        action={<OrderFilters search={search ?? ""} status={statusFilter} />}
        description="Update status after payment review, delivery, refund, or cancellation."
        title="Order queue"
      >
        {filteredOrders.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr className="border-b border-white/10">
                  <th className="py-3 pr-4 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Items</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="py-3 pl-4 font-semibold">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredOrders.map((order) => (
                  <tr
                    className="align-top transition hover:bg-white/[0.025]"
                    key={order.id}
                  >
                    <td className="py-4 pr-4">
                      <p className="font-bold text-white">
                        {shortOrderId(order.id)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatAdminDate(order.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-200">
                        {order.customerEmail}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        user · {order.userId.slice(0, 8)}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      {order.itemsCount.toLocaleString("en-US")}
                    </td>
                    <td className="px-4 py-4 font-bold text-white">
                      {formatMoney(order.totalCents)}
                    </td>
                    <td className="px-4 py-4">
                      <AdminStatusBadge status={order.status} />
                    </td>
                    <td className="py-4 pl-4">
                      <OrderStatusForm
                        canSave={context.canWrite}
                        order={order}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmptyState title="No matching orders">
            Adjust the status filter or search query to see more results.
          </AdminEmptyState>
        )}
      </AdminPanel>
    </AdminLayout>
  );
}

function OrderFilters({
  search,
  status,
}: {
  search: string;
  status: string | undefined;
}) {
  return (
    <form
      action="/admin/orders"
      className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"
    >
      <label className="relative block min-w-0 sm:w-72">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        <input
          className="h-10 w-full rounded-lg border border-white/10 bg-[#0a1223] pl-10 pr-3 text-sm text-white outline-none ring-violet-400/40 placeholder:text-slate-500 focus:ring-2"
          defaultValue={search}
          name="search"
          placeholder="Search order or email"
          type="search"
        />
      </label>
      <select
        className="h-10 rounded-lg border border-white/10 bg-[#0a1223] px-3 text-sm text-slate-200 outline-none ring-violet-400/40 focus:ring-2"
        defaultValue={status ?? "all"}
        name="status"
      >
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
        <option value="fulfilled">Fulfilled</option>
        <option value="canceled">Canceled</option>
        <option value="refunded">Refunded</option>
      </select>
      <button
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.07] hover:text-white"
        type="submit"
      >
        <RefreshCw className="size-4" />
        Apply
      </button>
    </form>
  );
}

function OrderMetric({
  detail,
  icon,
  label,
  value,
}: {
  detail: string;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#071020]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="grid size-11 place-items-center rounded-lg border border-violet-400/20 bg-violet-500/15 text-violet-300">
        {icon}
      </div>
      <p className="mt-5 text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function shortOrderId(id: string) {
  return id.startsWith("KH-") ? id : `KH-${id.slice(0, 8).toUpperCase()}`;
}

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
