import Link from "next/link";
import type { BookingParams } from "@/shared/portal/booking-data";
import {
  buildBookingsUrl,
  buildBranchesUrl,
  formatTimeLabel,
  getBookingSelection,
} from "@/shared/portal/booking-data";

type CustomerBookingsPanelProps = {
  params: BookingParams;
};

export function CustomerBookingsPanel({ params }: CustomerBookingsPanelProps) {
  const role = "customer";
  const { selectedBranch, selectedService, selectedDate, selectedTime, isConfirmed } =
    getBookingSelection(params);

  return (
    <section className="branches-page">
      <div className="branches-hero">
        <p className="branches-kicker">My Bookings</p>
        <h1>Your booking page</h1>
        <p>
          After you choose the branch, service, and time, the confirmed appointment appears here.
        </p>
      </div>

      <div className="portal-bookings-panel">
        <div className="portal-bookings-header">
          <div>
            <p className="portal-services-kicker">My Bookings</p>
            <h2>{isConfirmed ? "Booking confirmed" : "No confirmed booking yet"}</h2>
          </div>
          <span className={`portal-booking-badge ${isConfirmed ? "is-confirmed" : ""}`.trim()}>
            {isConfirmed ? "Confirmed" : "Pending"}
          </span>
        </div>

        {isConfirmed ? (
          <div className="portal-bookings-card">
            <div className="portal-bookings-summary">
              <div className="portal-booking-item">
                <span>Branch</span>
                <strong>{selectedBranch?.name}</strong>
              </div>
              <div className="portal-booking-item">
                <span>Service</span>
                <strong>{selectedService?.title}</strong>
              </div>
              <div className="portal-booking-item">
                <span>Date</span>
                <strong>{selectedDate?.longLabel}</strong>
              </div>
              <div className="portal-booking-item">
                <span>Time</span>
                <strong>{selectedTime ? formatTimeLabel(selectedTime) : ""}</strong>
              </div>
            </div>

            <div className="portal-bookings-actions">
              <Link
                href={buildBranchesUrl(
                  role,
                  {
                    branch: selectedBranch?.id,
                    service: selectedService?.id,
                    date: selectedDate?.value,
                    time: selectedTime,
                    confirmed: "1",
                  },
                  "booking-summary",
                )}
                className="portal-secondary-button"
              >
                Review Booking
              </Link>
              <Link
                href={buildBranchesUrl(role, {}, "branch-selection")}
                className="portal-primary-button"
              >
                Book Another Visit
              </Link>
            </div>
          </div>
        ) : (
          <div className="portal-bookings-empty">
            <p>
              Start with Branches, continue to Services, choose the time, and the confirmed booking
              will show here.
            </p>
            <div className="portal-bookings-actions">
              <Link
                href={buildBranchesUrl(role, {}, "branch-selection")}
                className="portal-primary-button"
              >
                Start Booking
              </Link>
              <Link href={buildBookingsUrl(role, params)} className="portal-secondary-button">
                Refresh Page
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
