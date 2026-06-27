import { OrdersView } from "@/views/account/orders-view";

type AccountOrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountOrdersPage({
  searchParams,
}: AccountOrdersPageProps) {
  return <OrdersView searchParams={await searchParams} />;
}
