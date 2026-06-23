import Link from "next/link";

import { siteConfig } from "@/shared/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/25">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Digital goods,
          delivered instantly.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/products" className="hover:text-foreground">
            Catalog
          </Link>
          <Link href="/account/orders" className="hover:text-foreground">
            Orders
          </Link>
          <Link href="/admin/dashboard" className="hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
