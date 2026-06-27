import {
  Archive,
  Boxes,
  Edit3,
  FileArchive,
  ImageIcon,
  PackageCheck,
  Plus,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { archiveProductAction } from "@/features/admin/actions";
import { ProductForm } from "@/features/admin/product-form";
import { formatMoney } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  type AdminProduct,
  getAdminCategories,
  getAdminContext,
  getAdminProducts,
} from "@/views/admin/admin-data";
import { AdminLayout } from "@/views/admin/admin-layout";
import {
  AdminEmptyState,
  AdminPanel,
  AdminStatusBadge,
  formatAdminDate,
} from "@/views/admin/admin-ui";

type ProductsViewProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export async function ProductsView({ searchParams = {} }: ProductsViewProps) {
  const [categories, context, products] = await Promise.all([
    getAdminCategories(),
    getAdminContext(),
    getAdminProducts(),
  ]);
  const selectedProductKey = normalizeParam(searchParams.edit);
  const selectedProduct = products.find(
    (product) =>
      product.id === selectedProductKey || product.slug === selectedProductKey,
  );
  const activeProducts = products.filter(
    (product) => product.status === "active",
  ).length;
  const draftProducts = products.filter(
    (product) => product.status === "draft",
  ).length;
  const configuredAssets = products.filter(
    (product) => product.asset.storagePath,
  ).length;

  return (
    <AdminLayout
      description="Create and manage digital goods, prices, images, and private assets."
      section="products"
      title="Products"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ProductMetric
          detail={`${activeProducts} active`}
          icon={<ShoppingBag className="size-5" />}
          label="Products"
          value={products.length.toLocaleString("en-US")}
        />
        <ProductMetric
          detail={`${draftProducts} awaiting launch`}
          icon={<Boxes className="size-5" />}
          label="Drafts"
          value={draftProducts.toLocaleString("en-US")}
        />
        <ProductMetric
          detail="Linked to private storage"
          icon={<FileArchive className="size-5" />}
          label="Assets"
          value={`${configuredAssets}/${products.length}`}
        />
        <ProductMetric
          detail="Average catalog price"
          icon={<PackageCheck className="size-5" />}
          label="Avg. price"
          value={formatMoney(getAveragePrice(products))}
        />
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_500px]">
        <AdminPanel
          action={
            selectedProduct ? (
              <Link
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.07] hover:text-white"
                href="/admin/products"
              >
                <Plus className="size-4" />
                New product
              </Link>
            ) : null
          }
          description="Use edit mode to update product copy, pricing, public imagery, and private delivery assets."
          title="Catalog products"
        >
          {products.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr className="border-b border-white/10">
                    <th className="py-3 pr-4 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Asset</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="py-3 pl-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className={cn(
                        "align-middle transition hover:bg-white/[0.025]",
                        selectedProduct?.id === product.id &&
                          "bg-violet-500/[0.06]",
                      )}
                    >
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <ProductPreview product={product} />
                          <div className="min-w-0">
                            <p className="line-clamp-1 font-semibold text-white">
                              {product.title}
                            </p>
                            <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                              /products/{product.slug} ·{" "}
                              {formatAdminDate(product.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {product.categoryName}
                        <span className="mt-1 block text-xs text-slate-500">
                          {product.fileTypes.join(", ")}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold text-white">
                        {formatMoney(product.priceCents)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="line-clamp-1 max-w-[170px] text-slate-300">
                          {product.asset.filename || "Not configured"}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {product.asset.sizeMb.toLocaleString("en-US")} MB
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <AdminStatusBadge status={product.status} />
                      </td>
                      <td className="py-4 pl-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.035] px-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.07] hover:text-white"
                            href={getProductEditHref(product)}
                          >
                            <Edit3 className="size-3.5" />
                            Edit
                          </Link>
                          <form action={archiveProductAction}>
                            <input type="hidden" name="id" value={product.id} />
                            <Button
                              className="border-white/10 bg-white/[0.035] text-slate-200 hover:bg-red-500/10 hover:text-red-200"
                              disabled={!context.canWrite}
                              size="sm"
                              type="submit"
                              variant="outline"
                            >
                              <Archive className="size-3.5" />
                              Archive
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <AdminEmptyState title="No products yet">
              Create the first digital good after Supabase admin access is
              connected.
            </AdminEmptyState>
          )}
        </AdminPanel>

        <ProductForm
          canSave={context.canWrite}
          categories={categories}
          product={selectedProduct}
        />
      </div>
    </AdminLayout>
  );
}

function ProductMetric({
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

function ProductPreview({ product }: { product: AdminProduct }) {
  return product.imageUrl ? (
    <Image
      src={product.imageUrl}
      alt={product.title}
      width={56}
      height={56}
      className="size-14 shrink-0 rounded-lg border border-white/10 object-cover"
    />
  ) : (
    <span className="grid size-14 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.035] text-slate-500">
      <ImageIcon className="size-5" />
    </span>
  );
}

function getAveragePrice(products: AdminProduct[]) {
  if (!products.length) {
    return 0;
  }

  return Math.round(
    products.reduce((total, product) => total + product.priceCents, 0) /
      products.length,
  );
}

function getProductEditHref(product: AdminProduct) {
  return `/admin/products?edit=${encodeURIComponent(product.id)}`;
}

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
