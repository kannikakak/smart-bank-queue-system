import { AdminBranchesView } from "@/admin/components/AdminBranchesView";
import { PortalHeader } from "@/shared/components/PortalHeader";
import { CustomerBookingFlow } from "@/customer/components/CustomerBookingFlow";
import { parseBookingParams } from "@/shared/portal/booking-query";
import { StaffBranchesView } from "@/staff/components/StaffBranchesView";
import { parsePortalRole } from "@/shared/portal/portal-role";

type BranchesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BranchesPage({ searchParams }: BranchesPageProps) {
  const rawParams = (await searchParams) ?? {};
  const role = parsePortalRole(rawParams.role);
  const bookingParams = parseBookingParams(rawParams);

  if (role === "admin") {
    return <AdminBranchesView />;
  }

  return (
    <main className="portal-page">
      <PortalHeader role={role} activeItem="branches" />
      {role === "customer" ? <CustomerBookingFlow params={bookingParams} /> : <StaffBranchesView />}
    </main>
  );
}
