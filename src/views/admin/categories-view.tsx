import { deleteCategoryAction } from "@/features/admin/actions";
import { CategoryForm } from "@/features/admin/category-form";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { getAdminCategories, getAdminContext } from "@/views/admin/admin-data";
import { AdminLayout } from "@/views/admin/admin-layout";

export async function CategoriesView() {
  const [categories, context] = await Promise.all([
    getAdminCategories(),
    getAdminContext(),
  ]);

  return (
    <AdminLayout
      description="Organize the storefront catalog with active states and sort order."
      section="categories"
      title="Categories"
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Catalog categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border rounded-lg border border-border">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="grid gap-3 p-4 md:grid-cols-[1fr_auto_auto]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{category.name}</p>
                      <Badge
                        variant={category.isActive ? "success" : "outline"}
                      >
                        {category.isActive ? "active" : "inactive"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {category.slug} · sort {category.sortOrder}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description || "No description"}
                  </p>
                  <form action={deleteCategoryAction}>
                    <input type="hidden" name="id" value={category.id} />
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={!context.canWrite}
                    >
                      Delete
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <CategoryForm canSave={context.canWrite} />
      </div>
    </AdminLayout>
  );
}
