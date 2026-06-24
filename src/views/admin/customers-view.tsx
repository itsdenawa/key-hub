import { formatMoney } from "@/shared/lib/format";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { getAdminCustomers } from "@/views/admin/admin-data";
import { AdminLayout } from "@/views/admin/admin-layout";

export async function CustomersView() {
  const customers = await getAdminCustomers();

  return (
    <AdminLayout
      description="View customer profiles, order counts, and account metadata."
      section="customers"
      title="Customers"
    >
      <Card>
        <CardHeader>
          <CardTitle>Customer accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border rounded-lg border border-border">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="grid gap-3 p-4 md:grid-cols-[1fr_auto_auto_auto]"
              >
                <div>
                  <p className="font-medium">{customer.fullName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {customer.email}
                  </p>
                </div>
                <Badge
                  variant={customer.role === "admin" ? "success" : "outline"}
                >
                  {customer.role}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {customer.orderCount} orders
                </p>
                <p className="font-medium">
                  {formatMoney(customer.totalSpendCents)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
