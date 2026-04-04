import { AdminRouteGuard } from "@/admin/components/AdminRouteGuard";
import { AdminDashboardSections } from "@/admin/components/AdminDashboardSections";
import { AdminWorkspaceShell } from "@/admin/components/AdminWorkspaceShell";

type AdminPortalHomeProps = {
  section?: "dashboard" | "staff" | "services" | "appointments" | "settings";
};

export function AdminPortalHome({ section = "dashboard" }: AdminPortalHomeProps) {
  return (
    <AdminRouteGuard>
      <AdminWorkspaceShell activeItem={section}>
        <AdminDashboardSections focus={section} />
      </AdminWorkspaceShell>
    </AdminRouteGuard>
  );
}
