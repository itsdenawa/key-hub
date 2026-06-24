import { Package, ReceiptText, Users } from "lucide-react";
import Link from "next/link";
import { demoOrders } from "@/entities/order/model";
import { products } from "@/entities/product/model";
import { getCurrentUserProfile } from "@/entities/user/session";
import { formatMoney } from "@/shared/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

type AdminShellProps = {
  title: string;
  description: string;
  section: "dashboard" | "products" | "categories" | "orders" | "customers";
};

const adminNav = [
  { label: "Dashboard", href: "/admin/dashboard", section: "dashboard" },
  { label: "Products", href: "/admin/products", section: "products" },
  { label: "Categories", href: "/admin/categories", section: "categories" },
  { label: "Orders", href: "/admin/orders", section: "orders" },
  { label: "Customers", href: "/admin/customers", section: "customers" },
] as const;

export function AdminShell({ title, description, section }: AdminShellProps) {
  return (
    <AdminShellContent
      title={title}
      description={description}
      section={section}
    />
  );
}

async function AdminShellContent({
  title,
  description,
  section,
}: AdminShellProps) {
  const { profile } = await getCurrentUserProfile();
  const revenueCents = demoOrders.reduce(
    (total, order) => total + order.totalCents,
    0,
  );

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside>
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
      </aside>
      <section className="space-y-5">
        <div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {profile?.role === "admin"
              ? `Signed in as ${profile.email}`
              : "Admin data uses demo values until Supabase admin access is configured."}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <ReceiptText className="size-4" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {formatMoney(revenueCents)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Package className="size-4" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{products.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="size-4" />
                Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">1</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
