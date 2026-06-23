import Link from "next/link";

import { demoOrders } from "@/entities/order/model";
import { demoProfile } from "@/entities/user/model";
import { formatMoney } from "@/shared/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

type AccountShellProps = {
  title: string;
  description: string;
  section: "profile" | "orders" | "wishlist" | "addresses";
};

const accountNav = [
  { label: "Profile", href: "/account/profile", section: "profile" },
  { label: "Orders", href: "/account/orders", section: "orders" },
  { label: "Wishlist", href: "/account/wishlist", section: "wishlist" },
  { label: "Addresses", href: "/account/addresses", section: "addresses" },
] as const;

export function AccountShell({
  title,
  description,
  section,
}: AccountShellProps) {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside>
        <nav className="grid gap-1" aria-label="Account">
          {accountNav.map((item) => (
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
      </aside>
      <section className="space-y-5">
        <div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Demo account state</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">User</p>
              <p className="font-medium">{demoProfile.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {demoProfile.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Orders</p>
              <p className="font-medium">{demoOrders.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lifetime spend</p>
              <p className="font-medium">
                {formatMoney(
                  demoOrders.reduce(
                    (total, order) => total + order.totalCents,
                    0,
                  ),
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
