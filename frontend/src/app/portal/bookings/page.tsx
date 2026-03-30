import { AdminBookingsView } from "@/admin/components/AdminBookingsView";
import { PortalHeader } from "@/shared/components/PortalHeader";
import { CustomerBookingsPanel } from "@/customer/components/CustomerBookingsPanel";
import { parseBookingParams } from "@/shared/portal/booking-query";
import { StaffBookingsView } from "@/staff/components/StaffBookingsView";
import { parsePortalRole } from "@/shared/portal/portal-role";

type BookingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const rawParams = (await searchParams) ?? {};
  const role = parsePortalRole(rawParams.role);
  const bookingParams = parseBookingParams(rawParams);

  if (role === "admin") {
    return <AdminBookingsView />;
  }

  return (
    <main className="portal-page">
      <PortalHeader role={role} activeItem="bookings" />
      {role === "customer" ? <CustomerBookingsPanel params={bookingParams} /> : <StaffBookingsView />}
    </main>
  );
}
