import { CategoriesView } from "@/views/admin/categories-view";

type AdminCategoriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  return <CategoriesView searchParams={await searchParams} />;
}
