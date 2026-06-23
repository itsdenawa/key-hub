import { AdminShell } from "@/views/admin/admin-shell";

export default function AdminCustomersPage() {
  return (
    <AdminShell
      section="customers"
      title="Customers"
      description="View customer profiles, order counts, and account metadata."
    />
  );
}
