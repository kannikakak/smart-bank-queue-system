import { AdminDashboardSections } from "@/admin/components/AdminDashboardSections";
import { AdminWorkspaceShell } from "@/admin/components/AdminWorkspaceShell";
export function AdminBranchesView() {
  return (
    <AdminWorkspaceShell activeItem="appointments">
      <AdminDashboardSections focus="appointments" />
    </AdminWorkspaceShell>
  );
}
