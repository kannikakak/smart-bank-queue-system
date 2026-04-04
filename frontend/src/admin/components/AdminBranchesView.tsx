import { AdminRouteGuard } from "@/admin/components/AdminRouteGuard";
import { AdminDashboardSections } from "@/admin/components/AdminDashboardSections";
import { AdminWorkspaceShell } from "@/admin/components/AdminWorkspaceShell";
export function AdminBranchesView() {
  return (
    <AdminRouteGuard>
      <AdminWorkspaceShell activeItem="appointments">
        <AdminDashboardSections focus="appointments" />
      </AdminWorkspaceShell>
    </AdminRouteGuard>
  );
}
