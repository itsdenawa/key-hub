import { AdminShell } from "@/views/admin/admin-shell";

export default function AdminOrdersPage() {
  return (
    <AdminShell
      section="orders"
      title="Orders"
      description="Inspect payment state, fulfillment, and customer entitlements."
    />
  );
}
