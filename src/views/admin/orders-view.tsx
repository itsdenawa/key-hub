import { OrderStatusForm } from "@/features/admin/order-status-form";
import { formatMoney } from "@/shared/lib/format";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { getAdminContext, getAdminOrders } from "@/views/admin/admin-data";
import { AdminLayout } from "@/views/admin/admin-layout";

export async function AdminOrdersView() {
  const [context, orders] = await Promise.all([
    getAdminContext(),
    getAdminOrders(),
  ]);

  return (
    <AdminLayout
      description="Inspect payment state, fulfillment, and customer entitlements."
      section="orders"
      title="Orders"
    >
      <Card>
        <CardHeader>
          <CardTitle>Order queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border rounded-lg border border-border">
            {orders.map((order) => (
              <div
                key={order.id}
                className="grid gap-4 p-4 lg:grid-cols-[1fr_140px_240px]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{shortOrderId(order.id)}</p>
                    <Badge
                      variant={
                        order.status === "fulfilled" ? "success" : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.customerEmail} · {order.itemsCount} items ·{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(new Date(order.createdAt))}
                  </p>
                </div>
                <p className="font-medium">{formatMoney(order.totalCents)}</p>
                <OrderStatusForm order={order} canSave={context.canWrite} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

function shortOrderId(id: string) {
  return id.startsWith("KH-") ? id : `KH-${id.slice(0, 8).toUpperCase()}`;
}
