import { AdminDashboardSections } from "@/admin/components/AdminDashboardSections";
import { AdminWorkspaceShell } from "@/admin/components/AdminWorkspaceShell";

type AdminPortalHomeProps = {
  section?: "dashboard" | "transactions" | "settings" | "help";
};

export function AdminPortalHome({ section = "dashboard" }: AdminPortalHomeProps) {
  return (
    <AdminWorkspaceShell activeItem={section}>
      <AdminDashboardSections focus={section} />
    </AdminWorkspaceShell>
  );
}
