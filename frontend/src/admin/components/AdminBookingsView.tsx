import { AdminRouteGuard } from "@/admin/components/AdminRouteGuard";
import { AdminDashboardSections } from "@/admin/components/AdminDashboardSections";
import { AdminWorkspaceShell } from "@/admin/components/AdminWorkspaceShell";
export function AdminBookingsView() {
  return (
    <AdminRouteGuard>
      <AdminWorkspaceShell activeItem="queue">
        <AdminDashboardSections focus="queue" />
      </AdminWorkspaceShell>
    </AdminRouteGuard>
  );
}
