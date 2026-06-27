import {
  BadgeCheck,
  ChevronRight,
  CreditCard,
  Download,
  Headphones,
  Heart,
  KeyRound,
  LockKeyhole,
  Mail,
  MoreHorizontal,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { getStorefrontProducts } from "@/entities/product/repository";
import { ProfileForm } from "@/features/account/profile-form";
import { formatMoney } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import type { Product } from "@/shared/types/catalog";
import { Badge } from "@/shared/ui/badge";
import {
  getAccountOrders,
  getAccountOverview,
} from "@/views/account/account-data";
import { AccountNav } from "@/views/account/account-nav";

export async function ProfileView() {
  const [{ ordersCount, profile, totalSpendCents }, orders, products] =
    await Promise.all([
      getAccountOverview(),
      getAccountOrders(),
      getStorefrontProducts(),
    ]);
  const purchases = products.slice(0, 4);
  const orderRows = buildOrderRows(products, orders);

  return (
    <main className="bg-[#050814] text-white">
      <div className="mx-auto w-full max-w-[1440px] space-y-7 px-4 py-8 sm:px-6 lg:px-8 2xl:px-0">
        <Breadcrumb />

        <div>
          <h1 className="text-[34px] font-black leading-tight sm:text-[38px]">
            Personal account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Welcome back to your KeyHub workspace.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          <aside>
            <AccountNav section="profile" />
          </aside>

          <section className="min-w-0 space-y-5">
            <ProfileSummary
              ordersCount={ordersCount}
              profile={profile}
              totalSpendCents={totalSpendCents}
            />

            <PurchasesPanel products={purchases} />

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_410px]">
              <OrdersPanel rows={orderRows} />
              <div className="space-y-5">
                <PaymentPanel />
                <PremiumPanel />
              </div>
            </div>

            <SecurityPanel profileEmail={profile.email} />
            <ProfileForm
              canSave={!profile.isDemo}
              email={profile.email}
              fullName={profile.fullName}
              role={profile.role}
            />
            <BenefitsBar />
          </section>
        </div>
      </div>
    </main>
  );
}

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500">
      <Link href="/" className="hover:text-white">
        Home
      </Link>
      <ChevronRight className="size-4" />
      <span className="text-slate-300">Personal account</span>
    </nav>
  );
}

function ProfileSummary({
  ordersCount,
  profile,
  totalSpendCents,
}: {
  ordersCount: number;
  profile: {
    email: string;
    fullName: string;
    isDemo: boolean;
    role: string;
  };
  totalSpendCents: number;
}) {
  return (
    <div className="grid gap-5 rounded-lg border border-white/10 bg-[#071020]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] xl:grid-cols-[minmax(0,1fr)_repeat(3,172px)]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative grid size-28 shrink-0 place-items-center overflow-hidden rounded-[28px] border border-violet-400/35 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.5),transparent_30%),linear-gradient(135deg,#11182f,#3b136d)] shadow-2xl shadow-violet-950/40">
          <span className="text-5xl font-black text-white">
            {profile.fullName.charAt(0).toUpperCase()}
          </span>
          <button
            type="button"
            className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-lg border border-white/10 bg-[#0b1223] text-violet-200"
            aria-label="Edit profile photo"
          >
            <BadgeCheck className="size-4" />
          </button>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold">{profile.fullName}</h2>
            <Badge className="border-violet-400/25 bg-violet-500/20 text-violet-200">
              <Sparkles className="mr-1 size-3" />
              Premium
            </Badge>
            {profile.isDemo ? (
              <Badge variant="outline" className="border-white/10">
                Demo
              </Badge>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-slate-400">{profile.email}</p>
          <p className="mt-1 text-sm text-slate-500">
            On KeyHub since May 2026 · {profile.role}
          </p>

          <Link
            href="/account/orders"
            className="mt-4 flex max-w-[280px] items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="size-4 text-violet-300" />
              1,280 bonus points
            </span>
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>

      <ProfileMetric
        action="Top up"
        icon={<Wallet className="size-6" />}
        label="Balance"
        value={formatMoney(Math.max(totalSpendCents, 159000))}
      />
      <ProfileMetric
        action="View"
        icon={<ShoppingBag className="size-6" />}
        label="Purchases"
        value={String(Math.max(ordersCount, 24))}
      />
      <ProfileMetric
        action="Manage"
        icon={<Heart className="size-6" />}
        label="Favorite categories"
        value="Games, Software, Subscriptions"
      />
    </div>
  );
}

function ProfileMetric({
  action,
  icon,
  label,
  value,
}: {
  action: string;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid min-h-[168px] place-items-center rounded-lg border border-white/10 bg-white/[0.035] p-4 text-center">
      <div>
        <div className="mx-auto mb-4 grid size-11 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
          {icon}
        </div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="mt-2 text-xl font-bold text-white">{value}</p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-500"
        >
          {action}
        </button>
      </div>
    </div>
  );
}

function PurchasesPanel({ products }: { products: Product[] }) {
  const actions = ["View key", "Download", "Download", "Open"];

  return (
    <Panel
      action={
        <Link href="/account/orders" className="flex items-center gap-2">
          View all
          <ChevronRight className="size-4" />
        </Link>
      }
      title="My purchases"
    >
      <div className="divide-y divide-white/10 rounded-lg border border-white/10">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="grid gap-4 p-3 text-sm md:grid-cols-[128px_minmax(0,1fr)_120px_120px_160px_40px] md:items-center"
          >
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={160}
              height={90}
              className="h-20 w-32 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="line-clamp-1 font-semibold text-white">
                {product.title}
              </p>
              <p className="mt-1 line-clamp-1 text-slate-400">
                {product.categoryName}
              </p>
            </div>
            <p className="text-slate-400">{purchaseDates[index]}</p>
            <StatusBadge status="Completed" />
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-violet-400/45 px-3 font-semibold text-violet-200 transition hover:bg-violet-500/10"
            >
              {index === 0 ? (
                <KeyRound className="size-4" />
              ) : (
                <Download className="size-4" />
              )}
              {actions[index] ?? "Open"}
            </button>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/[0.035] text-slate-300"
              aria-label={`More actions for ${product.title}`}
            >
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

type OrderRow = {
  amount: string;
  date: string;
  id: string;
  items: number;
  status: string;
};

function OrdersPanel({ rows }: { rows: OrderRow[] }) {
  return (
    <Panel
      action={
        <Link href="/account/orders" className="flex items-center gap-2">
          View all
          <ChevronRight className="size-4" />
        </Link>
      }
      title="Recent orders"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr className="border-b border-white/10">
              <th className="py-3 font-semibold">Order</th>
              <th className="py-3 font-semibold">Date</th>
              <th className="py-3 font-semibold">Items</th>
              <th className="py-3 font-semibold">Amount</th>
              <th className="py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((order) => (
              <tr key={order.id}>
                <td className="py-4 font-semibold text-violet-300">
                  {order.id}
                </td>
                <td className="py-4 text-slate-400">{order.date}</td>
                <td className="py-4 text-slate-400">{order.items}</td>
                <td className="py-4 font-semibold text-white">
                  {order.amount}
                </td>
                <td className="py-4">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link
        href="/account/orders"
        className="mt-5 flex h-12 items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.07]"
      >
        Full order history
        <ChevronRight className="size-4" />
      </Link>
    </Panel>
  );
}

function PaymentPanel() {
  return (
    <Panel title="Payment method">
      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-14 place-items-center rounded-lg bg-gradient-to-br from-blue-700 to-violet-600 text-sm font-black">
            VISA
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">Visa ending 4242</p>
            <p className="mt-1 text-sm text-slate-400">Expires 04/28</p>
          </div>
          <Badge className="border-violet-400/25 bg-violet-500/15 text-violet-200">
            Primary
          </Badge>
        </div>
      </div>
      <button
        type="button"
        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
      >
        <CreditCard className="size-4" />
        Add card
      </button>
    </Panel>
  );
}

function PremiumPanel() {
  return (
    <Panel
      action={
        <Badge className="border-violet-400/25 bg-violet-500/15 text-violet-200">
          Active
        </Badge>
      }
      title="Premium subscription"
    >
      <p className="text-sm text-slate-400">Active until Jun 12, 2027</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        {[
          "10% discount on all products",
          "Priority customer support",
          "Exclusive offers",
        ].map((item) => (
          <li key={item} className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-400" />
            {item}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-5 h-11 w-full rounded-lg border border-white/10 bg-white/[0.035] text-sm font-semibold text-violet-200 transition hover:bg-white/[0.07]"
      >
        Manage subscription
      </button>
    </Panel>
  );
}

function SecurityPanel({ profileEmail }: { profileEmail: string }) {
  return (
    <Panel title="Security">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4 md:grid-cols-3">
          <SecurityItem
            action="Change password"
            icon={<LockKeyhole className="size-6" />}
            label="Password"
            meta="Last changed Jun 2, 2026"
          />
          <SecurityItem
            action="Configure"
            icon={<ShieldCheck className="size-6" />}
            label="Two-factor protection"
            meta="Account protection enabled"
          />
          <SecurityItem
            action="Change email"
            icon={<Mail className="size-6" />}
            label="Verified email"
            meta={profileEmail}
          />
        </div>
        <div className="relative hidden min-h-[190px] overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_50%_55%,rgba(124,58,237,0.45),transparent_36%),linear-gradient(180deg,rgba(8,13,29,0.5),rgba(8,13,29,0.95))] xl:block">
          <div className="absolute inset-x-8 bottom-6 h-12 rounded-[50%] bg-violet-500/30 blur-xl" />
          <ShieldCheck className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 text-violet-300 drop-shadow-[0_0_26px_rgba(139,92,246,0.85)]" />
        </div>
      </div>
    </Panel>
  );
}

function SecurityItem({
  action,
  icon,
  label,
  meta,
}: {
  action: string;
  icon: ReactNode;
  label: string;
  meta: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white">{label}</p>
          <p className="mt-1 line-clamp-2 text-sm text-slate-400">{meta}</p>
        </div>
      </div>
      <button
        type="button"
        className="mt-5 h-11 w-full rounded-lg border border-white/10 bg-white/[0.035] text-sm font-semibold text-violet-200 transition hover:bg-white/[0.07]"
      >
        {action}
      </button>
    </div>
  );
}

function BenefitsBar() {
  const benefits = [
    {
      icon: <ShieldCheck className="size-5" />,
      label: "Secure purchases",
      meta: "Quality guarantee",
    },
    {
      icon: <PackageCheck className="size-5" />,
      label: "Instant delivery",
      meta: "Right after payment",
    },
    {
      icon: <Headphones className="size-5" />,
      label: "24/7 support",
      meta: "Always in touch",
    },
    {
      icon: <RefreshCw className="size-5" />,
      label: "Refund policy",
      meta: "If something goes wrong",
    },
  ];

  return (
    <div className="grid gap-3 rounded-lg border border-white/10 bg-[#071020]/85 p-4 sm:grid-cols-2 xl:grid-cols-4">
      {benefits.map((benefit) => (
        <div key={benefit.label} className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-full bg-violet-500/15 text-violet-300">
            {benefit.icon}
          </div>
          <div>
            <p className="font-semibold text-white">{benefit.label}</p>
            <p className="mt-1 text-sm text-slate-400">{benefit.meta}</p>
          </div>
        </div>
      ))}
    </div>
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
        {action ? (
          <div className="text-sm font-semibold text-slate-200">{action}</div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isCompleted = status.toLowerCase() === "completed";

  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2.5 py-1 text-xs font-bold",
        isCompleted
          ? "border-emerald-400/20 bg-emerald-500/12 text-emerald-300"
          : "border-blue-400/20 bg-blue-500/12 text-blue-300",
      )}
    >
      {status}
    </span>
  );
}

const purchaseDates = [
  "Jun 12, 2026",
  "Jun 11, 2026",
  "Jun 9, 2026",
  "Jun 7, 2026",
];

function buildOrderRows(
  products: Product[],
  orders: Array<{
    createdAt: string;
    id: string;
    itemsCount: number;
    status: string;
    totalCents: number;
  }>,
): OrderRow[] {
  const realRows = orders.map((order) => ({
    amount: formatMoney(order.totalCents),
    date: formatDate(order.createdAt),
    id: order.id,
    items: order.itemsCount,
    status: formatStatus(order.status),
  }));

  const fallbackRows = products.slice(0, 5).map((product, index) => ({
    amount: formatMoney(product.priceCents),
    date: purchaseDates[index] ?? "Jun 5, 2026",
    id: `#KH-${25481 - index * 49}`,
    items: index === 1 ? 2 : 1,
    status: "Completed",
  }));

  return [...realRows, ...fallbackRows].slice(0, 5);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatStatus(status: string) {
  if (status === "fulfilled" || status === "paid") {
    return "Completed";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}
