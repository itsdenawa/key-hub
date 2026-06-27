import { Boxes, Edit3, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { deleteCategoryAction } from "@/features/admin/actions";
import { CategoryForm } from "@/features/admin/category-form";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  type AdminCategory,
  getAdminCategories,
  getAdminContext,
} from "@/views/admin/admin-data";
import { AdminLayout } from "@/views/admin/admin-layout";
import {
  AdminEmptyState,
  AdminPanel,
  AdminStatusBadge,
} from "@/views/admin/admin-ui";

type CategoriesViewProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export async function CategoriesView({
  searchParams = {},
}: CategoriesViewProps) {
  const [categories, context] = await Promise.all([
    getAdminCategories(),
    getAdminContext(),
  ]);
  const selectedCategoryKey = normalizeParam(searchParams.edit);
  const selectedCategory = categories.find(
    (category) =>
      category.id === selectedCategoryKey ||
      category.slug === selectedCategoryKey,
  );
  const activeCategories = categories.filter(
    (category) => category.isActive,
  ).length;

  return (
    <AdminLayout
      description="Organize the storefront catalog with active states and sort order."
      section="categories"
      title="Categories"
    >
      <div className="grid gap-5 md:grid-cols-3">
        <CategoryMetric
          detail="Available storefront groups"
          icon={<Boxes className="size-5" />}
          label="Categories"
          value={categories.length.toLocaleString("en-US")}
        />
        <CategoryMetric
          detail="Visible in catalog navigation"
          icon={<Eye className="size-5" />}
          label="Active"
          value={activeCategories.toLocaleString("en-US")}
        />
        <CategoryMetric
          detail="Hidden from storefront filters"
          icon={<EyeOff className="size-5" />}
          label="Inactive"
          value={(categories.length - activeCategories).toLocaleString("en-US")}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px]">
        <AdminPanel
          action={
            selectedCategory ? (
              <Link
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.07] hover:text-white"
                href="/admin/categories"
              >
                <Plus className="size-4" />
                New category
              </Link>
            ) : null
          }
          description="Sort order controls storefront navigation order; inactive categories stay available for back-office organization."
          title="Catalog categories"
        >
          {categories.length ? (
            <div className="space-y-3">
              {categories.map((category) => (
                <CategoryRow
                  canWrite={context.canWrite}
                  category={category}
                  isSelected={selectedCategory?.id === category.id}
                  key={category.id}
                />
              ))}
            </div>
          ) : (
            <AdminEmptyState title="No categories yet">
              Create category groups before adding production catalog items.
            </AdminEmptyState>
          )}
        </AdminPanel>

        <CategoryForm canSave={context.canWrite} category={selectedCategory} />
      </div>
    </AdminLayout>
  );
}

function CategoryRow({
  canWrite,
  category,
  isSelected,
}: {
  canWrite: boolean;
  category: AdminCategory;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-4 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.04] lg:grid-cols-[minmax(0,1fr)_120px_180px]",
        isSelected && "border-violet-400/30 bg-violet-500/[0.07]",
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg border border-white/10 bg-violet-500/15 text-violet-300">
            {category.sortOrder}
          </span>
          <div className="min-w-0">
            <p className="line-clamp-1 font-bold text-white">{category.name}</p>
            <p className="mt-1 line-clamp-1 text-sm text-slate-500">
              /products?category={category.slug}
            </p>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
          {category.description || "No description yet."}
        </p>
      </div>

      <div className="flex items-start lg:justify-center">
        <AdminStatusBadge status={category.isActive ? "active" : "inactive"} />
      </div>

      <div className="flex flex-wrap items-start gap-2 lg:justify-end">
        <Link
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.035] px-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.07] hover:text-white"
          href={`/admin/categories?edit=${encodeURIComponent(category.id)}`}
        >
          <Edit3 className="size-3.5" />
          Edit
        </Link>
        <form action={deleteCategoryAction}>
          <input type="hidden" name="id" value={category.id} />
          <Button
            className="border-white/10 bg-white/[0.035] text-red-200 hover:bg-red-500/10"
            disabled={!canWrite}
            size="sm"
            type="submit"
            variant="outline"
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </form>
      </div>
    </div>
  );
}

function CategoryMetric({
  detail,
  icon,
  label,
  value,
}: {
  detail: string;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#071020]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="grid size-11 place-items-center rounded-lg border border-violet-400/20 bg-violet-500/15 text-violet-300">
        {icon}
      </div>
      <p className="mt-5 text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
