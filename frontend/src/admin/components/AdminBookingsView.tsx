import { AdminDashboardSections } from "@/admin/components/AdminDashboardSections";
import { AdminWorkspaceShell } from "@/admin/components/AdminWorkspaceShell";
export function AdminBookingsView() {
  return (
    <AdminWorkspaceShell activeItem="queue">
      <AdminDashboardSections focus="queue" />
    </AdminWorkspaceShell>
  );
}
