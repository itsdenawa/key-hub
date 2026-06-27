import { AdminOrdersView } from "@/views/admin/orders-view";

type AdminOrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  return <AdminOrdersView searchParams={await searchParams} />;
}
