import { AdminShell } from "@/views/admin/admin-shell";

export default function AdminDashboardPage() {
  return (
    <AdminShell
      section="dashboard"
      title="Admin dashboard"
      description="Revenue, orders, customers, and recent activity live here."
    />
  );
}
