import { Crown, Mail, Search, ShoppingBag, UsersRound } from "lucide-react";
import type { ReactNode } from "react";

import { formatMoney } from "@/shared/lib/format";
import {
  type AdminCustomer,
  getAdminCustomers,
} from "@/views/admin/admin-data";
import { AdminLayout } from "@/views/admin/admin-layout";
import {
  AdminEmptyState,
  AdminPanel,
  AdminStatusBadge,
  formatAdminDate,
} from "@/views/admin/admin-ui";

type CustomersViewProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export async function CustomersView({ searchParams = {} }: CustomersViewProps) {
  const customers = await getAdminCustomers();
  const search = normalizeParam(searchParams.search)?.trim().toLowerCase();
  const filteredCustomers = customers.filter(
    (customer) =>
      !search ||
      customer.email.toLowerCase().includes(search) ||
      customer.fullName.toLowerCase().includes(search) ||
      customer.id.toLowerCase().includes(search),
  );
  const totalSpendCents = customers.reduce(
    (total, customer) => total + customer.totalSpendCents,
    0,
  );
  const adminCount = customers.filter(
    (customer) => customer.role === "admin",
  ).length;

  return (
    <AdminLayout
      description="View customer profiles, order counts, and account metadata."
      section="customers"
      title="Customers"
    >
      <div className="grid gap-5 md:grid-cols-3">
        <CustomerMetric
          detail="Registered KeyHub accounts"
          icon={<UsersRound className="size-5" />}
          label="Customers"
          value={customers.length.toLocaleString("en-US")}
        />
        <CustomerMetric
          detail="Lifetime customer spend"
          icon={<ShoppingBag className="size-5" />}
          label="Total spend"
          value={formatMoney(totalSpendCents)}
        />
        <CustomerMetric
          detail="Profiles with write access"
          icon={<Crown className="size-5" />}
          label="Admins"
          value={adminCount.toLocaleString("en-US")}
        />
      </div>

      <AdminPanel
        action={<CustomerSearch search={search ?? ""} />}
        description="Customers are read-only in this phase; role changes should stay behind explicit admin actions."
        title="Customer accounts"
      >
        {filteredCustomers.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr className="border-b border-white/10">
                  <th className="py-3 pr-4 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Orders</th>
                  <th className="px-4 py-3 font-semibold">Spend</th>
                  <th className="py-3 pl-4 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredCustomers.map((customer) => (
                  <CustomerRow customer={customer} key={customer.id} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmptyState title="No matching customers">
            Try another name, email, or customer identifier.
          </AdminEmptyState>
        )}
      </AdminPanel>
    </AdminLayout>
  );
}

function CustomerRow({ customer }: { customer: AdminCustomer }) {
  return (
    <tr className="align-middle transition hover:bg-white/[0.025]">
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-violet-400/25 bg-violet-500/15 text-sm font-black text-violet-200">
            {getInitials(customer.fullName)}
          </span>
          <div className="min-w-0">
            <p className="line-clamp-1 font-semibold text-white">
              {customer.fullName}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Mail className="size-3.5" />
              {customer.email}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <AdminStatusBadge status={customer.role} />
      </td>
      <td className="px-4 py-4 text-slate-300">
        {customer.orderCount.toLocaleString("en-US")}
      </td>
      <td className="px-4 py-4 font-bold text-white">
        {formatMoney(customer.totalSpendCents)}
      </td>
      <td className="py-4 pl-4 text-slate-500">
        {formatAdminDate(customer.createdAt)}
      </td>
    </tr>
  );
}

function CustomerSearch({ search }: { search: string }) {
  return (
    <form action="/admin/customers" className="relative block w-full sm:w-80">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
      <input
        className="h-10 w-full rounded-lg border border-white/10 bg-[#0a1223] pl-10 pr-3 text-sm text-white outline-none ring-violet-400/40 placeholder:text-slate-500 focus:ring-2"
        defaultValue={search}
        name="search"
        placeholder="Search customer"
        type="search"
      />
    </form>
  );
}

function CustomerMetric({
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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
