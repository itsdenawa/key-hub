import Link from "next/link";

import type { AdminSection } from "@/views/admin/admin-data";

const adminNav = [
  { label: "Dashboard", href: "/admin/dashboard", section: "dashboard" },
  { label: "Products", href: "/admin/products", section: "products" },
  { label: "Categories", href: "/admin/categories", section: "categories" },
  { label: "Orders", href: "/admin/orders", section: "orders" },
  { label: "Customers", href: "/admin/customers", section: "customers" },
] as const;

type AdminNavProps = {
  section: AdminSection;
};

export function AdminNav({ section }: AdminNavProps) {
  return (
    <nav className="grid gap-1" aria-label="Admin">
      {adminNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`rounded-lg px-3 py-2 text-sm ${
            item.section === section
              ? "bg-accent font-medium text-accent-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
