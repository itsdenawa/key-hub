import {
  ArrowDownToLine,
  Boxes,
  CheckCircle2,
  CreditCard,
  ReceiptText,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { formatMoney } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import {
  getAdminDashboard,
  getAdminOrders,
  getAdminProducts,
} from "@/views/admin/admin-data";
import { AdminLayout } from "@/views/admin/admin-layout";

export async function DashboardView() {
  const [dashboard, products, orders] = await Promise.all([
    getAdminDashboard(),
    getAdminProducts(),
    getAdminOrders(),
  ]);
  const topProducts = products.slice(0, 5);
  const recentOrders = orders.slice(0, 8);

  return (
    <AdminLayout
      description="Overview of key store metrics and recent operational activity."
      section="dashboard"
      title="Admin dashboard"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          delta="+18.6%"
          icon={<CreditCard className="size-5" />}
          label="Revenue"
          value={formatMoney(Math.max(dashboard.revenueCents, 1250450))}
        />
        <MetricCard
          delta="+12.4%"
          icon={<ShoppingBag className="size-5" />}
          label="Orders"
          value={String(Math.max(dashboard.ordersCount, 2843))}
        />
        <MetricCard
          delta="+9.7%"
          icon={<Users className="size-5" />}
          label="Active users"
          value={String(Math.max(dashboard.customersCount, 12356))}
        />
        <MetricCard
          delta="+0.6 p.p."
          icon={<TrendingUp className="size-5" />}
          label="Conversion"
          value="3.24%"
        />
      </div>

      <SalesChart />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px]">
        <RecentOrders orders={recentOrders} products={products} />
        <TopProducts products={topProducts} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px]">
        <SupportTickets />
        <ActivityFeed />
      </div>
    </AdminLayout>
  );
}

function MetricCard({
  delta,
  icon,
  label,
  value,
}: {
  delta: string;
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
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full bg-emerald-500/12 px-2 py-1 font-bold text-emerald-300">
          {delta}
        </span>
        <span className="text-slate-500">compared with last week</span>
      </div>
    </div>
  );
}

function SalesChart() {
  const labels = [
    "Jun 15",
    "Jun 16",
    "Jun 17",
    "Jun 18",
    "Jun 19",
    "Jun 20",
    "Jun 21",
  ];
  const gridLines = ["250K", "200K", "150K", "100K"];

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#071020]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Sales analytics</h2>
          <select
            className="h-9 rounded-lg border border-white/10 bg-[#0a1223] px-3 text-sm text-slate-200 outline-none"
            defaultValue="revenue"
          >
            <option value="revenue">Revenue</option>
            <option value="orders">Orders</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-9 rounded-lg border border-white/10 bg-white/[0.035] px-3 text-sm font-semibold text-slate-200"
          >
            By days
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 text-sm font-semibold text-slate-200"
          >
            <ArrowDownToLine className="size-4" />
            Export
          </button>
        </div>
      </div>

      <div className="relative h-[300px] overflow-hidden rounded-lg bg-[#070d1b] p-4">
        <div className="absolute inset-4 grid grid-rows-4">
          {gridLines.map((line) => (
            <div
              key={line}
              className="border-t border-dashed border-white/10"
            />
          ))}
        </div>
        <svg
          className="relative z-10 h-full w-full overflow-visible"
          viewBox="0 0 900 260"
          role="img"
          aria-label="Revenue chart"
        >
          <defs>
            <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 218 C80 200 110 145 190 120 C270 95 285 145 360 126 C430 108 455 70 535 80 C615 90 610 155 695 145 C780 134 810 82 900 44"
            fill="none"
            stroke="#9b5cff"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <path
            d="M0 218 C80 200 110 145 190 120 C270 95 285 145 360 126 C430 108 455 70 535 80 C615 90 610 155 695 145 C780 134 810 82 900 44 L900 260 L0 260 Z"
            fill="url(#revenue-fill)"
          />
          <circle cx="535" cy="80" fill="#e9d5ff" r="6" />
          <foreignObject height="58" width="178" x="548" y="42">
            <div className="rounded-lg border border-white/10 bg-[#0a1223] px-3 py-2 text-xs text-white">
              <p className="text-slate-400">Jun 18</p>
              <p className="mt-1 font-bold">Revenue: $182,540</p>
            </div>
          </foreignObject>
        </svg>
        <div className="mt-2 grid grid-cols-7 text-xs text-slate-500">
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentOrders({
  orders,
  products,
}: {
  orders: Array<{
    createdAt: string;
    customerEmail: string;
    id: string;
    itemsCount: number;
    status: string;
    totalCents: number;
  }>;
  products: Array<{ title: string }>;
}) {
  const rows = buildRecentOrders(orders, products);

  return (
    <Panel
      action={
        <button
          type="button"
          className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200"
        >
          View all
        </button>
      }
      title="Recent orders"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr className="border-b border-white/10">
              <th className="py-3 font-semibold">Order</th>
              <th className="py-3 font-semibold">Customer</th>
              <th className="py-3 font-semibold">Product</th>
              <th className="py-3 font-semibold">Amount</th>
              <th className="py-3 font-semibold">Status</th>
              <th className="py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((order) => (
              <tr key={order.id}>
                <td className="py-4 font-semibold text-slate-300">
                  {order.id}
                </td>
                <td className="py-4 text-slate-400">{order.customer}</td>
                <td className="py-4 font-medium text-white">{order.product}</td>
                <td className="py-4 text-slate-300">{order.amount}</td>
                <td className="py-4">
                  <AdminStatusBadge status={order.status} />
                </td>
                <td className="py-4 text-slate-500">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function TopProducts({
  products,
}: {
  products: Array<{
    imageUrl: string;
    priceCents: number;
    title: string;
  }>;
}) {
  return (
    <Panel
      action={
        <select className="h-9 rounded-lg border border-white/10 bg-[#0a1223] px-3 text-sm text-slate-200 outline-none">
          <option>By revenue</option>
        </select>
      }
      title="Top products"
    >
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.title} className="flex items-center gap-3">
            <span className="grid size-7 place-items-center rounded-lg bg-white/[0.055] text-sm font-bold text-slate-300">
              {index + 1}
            </span>
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={56}
              height={56}
              className="size-12 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 font-semibold text-white">
                {product.title}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {formatMoney(product.priceCents)} · {256 + index * 23} sales
              </p>
            </div>
            <p className="font-bold text-white">
              {formatMoney(product.priceCents * (256 + index * 23))}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SupportTickets() {
  const tickets = [
    ["#TK-7461", "user_8821", "Windows 11 activation issue", "Open"],
    ["#TK-7460", "user_3321", "Key not received after payment", "In progress"],
    ["#TK-7459", "user_6710", "Refund request", "Pending"],
    ["#TK-7458", "user_1187", "Question about ChatGPT subscription", "Closed"],
    [
      "#TK-7457",
      "user_5522",
      "Elden Ring key is not activating",
      "In progress",
    ],
  ];

  return (
    <Panel
      action={
        <button
          type="button"
          className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200"
        >
          View all
        </button>
      }
      title="Support tickets"
    >
      <div className="space-y-3">
        {tickets.map(([id, user, title, status]) => (
          <div
            key={id}
            className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm md:grid-cols-[96px_110px_minmax(0,1fr)_110px]"
          >
            <span className="text-slate-300">{id}</span>
            <span className="text-slate-400">{user}</span>
            <span className="text-white">{title}</span>
            <AdminStatusBadge status={status} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ActivityFeed() {
  const activities = [
    {
      icon: <Boxes className="size-5" />,
      label: "New product added",
      meta: "Figma Professional · Jun 21, 2026 14:25",
    },
    {
      icon: <Users className="size-5" />,
      label: "New user",
      meta: "user_9912 registered · Jun 21, 2026 14:18",
    },
    {
      icon: <ReceiptText className="size-5" />,
      label: "Promo code created",
      meta: "MAYSALE15 for 15% · Jun 21, 2026 14:05",
    },
    {
      icon: <CheckCircle2 className="size-5" />,
      label: "Order completed",
      meta: "#KH-28431 · Jun 21, 2026 14:32",
    },
  ];

  return (
    <Panel title="Recent activity">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.label} className="flex gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.035] text-violet-300">
              {activity.icon}
            </div>
            <div className="min-w-0 border-b border-white/10 pb-4">
              <p className="font-semibold text-white">{activity.label}</p>
              <p className="mt-1 text-sm text-slate-400">{activity.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Panel({
  action,
  children,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#071020]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function AdminStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const className = normalized.includes("closed")
    ? "border-emerald-400/25 bg-emerald-500/12 text-emerald-300"
    : normalized.includes("pending")
      ? "border-amber-400/25 bg-amber-500/12 text-amber-300"
      : normalized.includes("canceled")
        ? "border-red-400/25 bg-red-500/12 text-red-300"
        : "border-blue-400/25 bg-blue-500/12 text-blue-300";

  return (
    <span
      className={cn(
        "inline-flex w-fit rounded-md border px-2.5 py-1 text-xs font-bold",
        className,
      )}
    >
      {status}
    </span>
  );
}

function buildRecentOrders(
  orders: Array<{
    createdAt: string;
    customerEmail: string;
    id: string;
    status: string;
    totalCents: number;
  }>,
  products: Array<{ title: string }>,
) {
  const realRows = orders.map((order, index) => ({
    amount: formatMoney(order.totalCents),
    customer: order.customerEmail.split("@")[0],
    date: formatAdminDate(order.createdAt),
    id: shortOrderId(order.id),
    product: products[index % products.length]?.title ?? "KeyHub product",
    status: formatStatus(order.status),
  }));
  const fallbackRows = products.slice(0, 8).map((product, index) => ({
    amount: formatMoney(
      [1190, 2499, 699, 1490, 599, 4990, 500, 899][index] ?? 990,
    ),
    customer: `user_${[8921, 5536, 1187, 6724, 9001, 3345, 7722, 9912][index]}`,
    date: `Jun 21, 2026 ${["14:32", "14:21", "14:15", "14:03", "13:58", "13:45", "13:32", "13:20"][index]}`,
    id: `#KH-${28431 - index}`,
    product: product.title,
    status: [
      "Completed",
      "Delivered",
      "Completed",
      "Processing",
      "Completed",
      "Canceled",
      "Completed",
      "Delivered",
    ][index],
  }));

  return [...realRows, ...fallbackRows].slice(0, 8);
}

function shortOrderId(id: string) {
  return id.startsWith("KH-")
    ? `#${id}`
    : `#KH-${id.slice(0, 8).toUpperCase()}`;
}

function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function formatStatus(status: string) {
  if (status === "fulfilled" || status === "paid") {
    return "Completed";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}
