import { ProductsView } from "@/views/admin/products-view";

type AdminProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  return <ProductsView searchParams={await searchParams} />;
}
