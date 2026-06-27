import { CustomersView } from "@/views/admin/customers-view";

type AdminCustomersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCustomersPage({
  searchParams,
}: AdminCustomersPageProps) {
  return <CustomersView searchParams={await searchParams} />;
}
