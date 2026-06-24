import { Package, ReceiptText, Shapes, ShoppingBag, Users } from "lucide-react";
import type { ReactNode } from "react";

import { formatMoney } from "@/shared/lib/format";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { getAdminDashboard } from "@/views/admin/admin-data";
import { AdminLayout } from "@/views/admin/admin-layout";

export async function DashboardView() {
  const dashboard = await getAdminDashboard();

  return (
    <AdminLayout
      description="Revenue, orders, customers, and recent activity."
      section="dashboard"
      title="Admin dashboard"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          icon={<ReceiptText className="size-4" />}
          label="Revenue"
          value={formatMoney(dashboard.revenueCents)}
        />
        <MetricCard
          icon={<ShoppingBag className="size-4" />}
          label="Orders"
          value={String(dashboard.ordersCount)}
        />
        <MetricCard
          icon={<Users className="size-4" />}
          label="Customers"
          value={String(dashboard.customersCount)}
        />
        <MetricCard
          icon={<Package className="size-4" />}
          label="Products"
          value={`${dashboard.activeProducts}/${dashboard.productsCount}`}
        />
        <MetricCard
          icon={<Shapes className="size-4" />}
          label="Categories"
          value={String(dashboard.categoriesCount)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border rounded-lg border border-border">
            {dashboard.recentOrders.map((order) => (
              <div
                key={order.id}
                className="grid gap-3 p-4 text-sm md:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  <p className="font-medium">{order.customerEmail}</p>
                  <p className="text-muted-foreground">
                    {shortOrderId(order.id)} · {order.itemsCount} items
                  </p>
                </div>
                <p className="font-medium">{formatMoney(order.totalCents)}</p>
                <Badge
                  variant={order.status === "fulfilled" ? "success" : "outline"}
                >
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function shortOrderId(id: string) {
  return id.startsWith("KH-") ? id : `KH-${id.slice(0, 8).toUpperCase()}`;
}
