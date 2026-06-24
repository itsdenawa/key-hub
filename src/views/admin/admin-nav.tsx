import {
  Boxes,
  CalendarDays,
  Gift,
  Headphones,
  LayoutDashboard,
  Mail,
  Plus,
  Settings,
  ShoppingBag,
  Tags,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

import { cn } from "@/shared/lib/utils";
import type { AdminSection } from "@/views/admin/admin-data";

type AdminNavItem = {
  badge?: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  section?: AdminSection;
};

const adminNav: AdminNavItem[] = [
  {
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    label: "Overview",
    section: "dashboard",
  },
  {
    href: "/admin/products",
    icon: ShoppingBag,
    label: "Products",
    section: "products",
  },
  {
    badge: "24",
    href: "/admin/orders",
    icon: CalendarDays,
    label: "Orders",
    section: "orders",
  },
  {
    href: "/admin/customers",
    icon: UsersRound,
    label: "Users",
    section: "customers",
  },
  {
    href: "/admin/categories",
    icon: Boxes,
    label: "Categories",
    section: "categories",
  },
  {
    href: "/admin/products",
    icon: Tags,
    label: "Promo codes",
    section: "products",
  },
  {
    href: "/admin/dashboard",
    icon: Headphones,
    label: "Support",
    badge: "7",
  },
  {
    href: "/admin/dashboard",
    icon: Settings,
    label: "Settings",
  },
];

const quickActions = [
  { icon: Plus, label: "Add product" },
  { icon: Gift, label: "Create promo code" },
  { icon: Plus, label: "Add category" },
  { icon: Mail, label: "Send campaign" },
];

type AdminNavProps = {
  section: AdminSection;
};

export function AdminNav({ section }: AdminNavProps) {
  return (
    <aside className="flex h-full min-h-[980px] flex-col border-white/10 bg-[#071020]/90 p-4">
      <div className="mb-7 flex items-center gap-3 px-2">
        <div className="grid size-10 place-items-center rounded-lg border border-violet-400/35 bg-violet-500/15 text-violet-300">
          <ShoppingBag className="size-5" />
        </div>
        <div>
          <p className="text-xl font-black text-white">KeyHub</p>
          <p className="text-xs text-slate-500">Admin console</p>
        </div>
      </div>

      <nav className="space-y-1" aria-label="Admin">
        {adminNav.map((item) => {
          const Icon = item.icon;
          const isActive = item.section === section;

          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "flex h-12 items-center justify-between rounded-lg px-3 text-sm font-semibold transition",
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-violet-900/70 text-white shadow-lg shadow-violet-950/30"
                  : "text-slate-300 hover:bg-white/[0.055] hover:text-white",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-5" />
                {item.label}
              </span>
              {item.badge ? (
                <span className="rounded-full bg-violet-600 px-2 py-0.5 text-xs text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.025] p-4">
        <h2 className="text-sm font-bold text-white">Quick actions</h2>
        <div className="mt-4 space-y-3">
          {quickActions.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center gap-3 text-left text-sm text-slate-300 transition hover:text-white"
              >
                <Icon className="size-4 text-violet-300" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto space-y-4 pt-8">
        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
          <p className="text-xs text-slate-500">Current plan</p>
          <p className="mt-2 text-lg font-bold text-violet-300">Business</p>
          <p className="mt-1 text-sm text-slate-400">
            Active until Jun 15, 2027
          </p>
          <button
            type="button"
            className="mt-4 h-10 w-full rounded-lg border border-white/10 bg-white/[0.035] text-sm font-semibold text-white"
          >
            Manage plan
          </button>
        </div>
        <p className="px-2 text-xs text-slate-500">
          © 2026 KeyHub Admin. All rights reserved.
        </p>
      </div>
    </aside>
  );
}
