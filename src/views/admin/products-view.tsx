import { archiveProductAction } from "@/features/admin/actions";
import { ProductForm } from "@/features/admin/product-form";
import { formatMoney } from "@/shared/lib/format";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  getAdminCategories,
  getAdminContext,
  getAdminProducts,
} from "@/views/admin/admin-data";
import { AdminLayout } from "@/views/admin/admin-layout";

export async function ProductsView() {
  const [categories, context, products] = await Promise.all([
    getAdminCategories(),
    getAdminContext(),
    getAdminProducts(),
  ]);

  return (
    <AdminLayout
      description="Create and manage digital goods, prices, images, and private assets."
      section="products"
      title="Products"
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_460px]">
        <Card>
          <CardHeader>
            <CardTitle>Catalog products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border rounded-lg border border-border">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="grid gap-3 p-4 md:grid-cols-[1fr_auto_auto]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{product.title}</p>
                      <Badge
                        variant={
                          product.status === "active" ? "success" : "outline"
                        }
                      >
                        {product.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.categoryName} · {product.slug} ·{" "}
                      {product.fileTypes.join(", ")}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatMoney(product.priceCents)}
                  </p>
                  <form action={archiveProductAction}>
                    <input type="hidden" name="id" value={product.id} />
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={!context.canWrite}
                    >
                      Archive
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <ProductForm categories={categories} canSave={context.canWrite} />
      </div>
    </AdminLayout>
  );
}
