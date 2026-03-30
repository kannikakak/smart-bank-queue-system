import { PortalHeader } from "@/shared/components/PortalHeader";
import { AdminPortalHome } from "@/admin/components/AdminPortalHome";
import { CustomerPortalHome } from "@/customer/components/CustomerPortalHome";
import { parseBookingParams } from "@/shared/portal/booking-query";
import { StaffPortalHome } from "@/staff/components/StaffPortalHome";
import { parsePortalRole } from "@/shared/portal/portal-role";

type PortalPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function parseAdminSection(value: string | string[] | undefined) {
  const section = Array.isArray(value) ? value[0] : value;

  if (section === "transactions" || section === "settings" || section === "help") {
    return section;
  }

  return "dashboard";
}

export default async function PortalPage({ searchParams }: PortalPageProps) {
  const rawParams = (await searchParams) ?? {};
  const role = parsePortalRole(rawParams.role);
  const bookingParams = parseBookingParams(rawParams);

  if (role === "admin") {
    return <AdminPortalHome section={parseAdminSection(rawParams.section)} />;
  }

  return (
    <main className="portal-page">
      <PortalHeader role={role} activeItem="home" />
      {role === "customer" ? (
        <CustomerPortalHome params={bookingParams} isConfirmed={Boolean(bookingParams.confirmed)} />
      ) : (
        <StaffPortalHome />
      )}
    </main>
  );
}
