import {
  Bell,
  Headphones,
  Heart,
  LogOut,
  Package,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

import { cn } from "@/shared/lib/utils";

export type AccountSection = "profile" | "orders" | "wishlist" | "addresses";

type AccountNavItem = {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  section?: AccountSection;
};

const accountNav: AccountNavItem[] = [
  {
    href: "/account/profile",
    icon: UserRound,
    label: "Profile",
    section: "profile",
  },
  {
    href: "/account/orders",
    icon: Package,
    label: "My purchases",
    section: "orders",
  },
  {
    href: "/account/orders",
    icon: ReceiptText,
    label: "Orders",
    section: "orders",
  },
  {
    href: "/account/wishlist",
    icon: Heart,
    label: "Favorites",
    section: "wishlist",
  },
  {
    href: "/account/profile",
    icon: ShieldCheck,
    label: "Security",
  },
  {
    href: "/account/profile",
    icon: Bell,
    label: "Notifications",
  },
  {
    href: "/account/profile",
    icon: Headphones,
    label: "Support",
  },
];

type AccountNavProps = {
  section: AccountSection;
};

export function AccountNav({ section }: AccountNavProps) {
  return (
    <nav
      className="overflow-hidden rounded-lg border border-white/10 bg-[#071020]/90 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      aria-label="Account"
    >
      <div className="space-y-1">
        {accountNav.map((item) => {
          const Icon = item.icon;
          const isActive = item.section === section;

          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "flex h-12 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition",
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-violet-900/70 text-white shadow-lg shadow-violet-950/30"
                  : "text-slate-300 hover:bg-white/[0.055] hover:text-white",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-40 border-t border-white/10 pt-3 lg:mt-52">
        <button
          type="button"
          className="flex h-11 w-full items-center gap-3 rounded-lg border border-red-400/35 px-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </nav>
  );
}
