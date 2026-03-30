import Link from "next/link";

export function StaffBookingsView() {
  const queueSnapshot = [
    { label: "Scheduled today", value: "12 appointments" },
    { label: "Checked in", value: "4 customers ready" },
    { label: "Delayed", value: "1 follow-up needed" },
    { label: "Next arrival", value: "11:15 AM" },
  ];

  const activeEntries = [
    {
      customer: "Michael Roberts",
      time: "11:15 AM",
      service: "Mortgage Loan",
      note: "Advisor room booked and desk team notified.",
    },
    {
      customer: "Elena Rodriguez",
      time: "01:00 PM",
      service: "Business Account",
      note: "Customer requested document review before check-in.",
    },
    {
      customer: "Sarah Jenkins",
      time: "10:30 AM",
      service: "Personal Banking",
      note: "Already checked in and ready for desk handoff.",
    },
  ];

  return (
    <section className="branches-page">
      <div className="branches-hero">
        <p className="branches-kicker">Staff bookings</p>
        <h1>Customer appointments and service support</h1>
        <p>Use this page to follow arrivals, prepare counters, and keep queue flow efficient.</p>
      </div>

      <div className="portal-bookings-panel">
        <div className="portal-bookings-header">
          <div>
            <p className="portal-services-kicker">Staff queue support</p>
            <h2>Appointment handling view</h2>
          </div>
          <span className="portal-booking-badge is-confirmed">Live board</span>
        </div>

        <div className="portal-bookings-summary">
          {queueSnapshot.map((item) => (
            <div key={item.label} className="portal-booking-item">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <div className="portal-bookings-card">
          <p>
            Use this board to keep staff aligned on the next arrivals, customer status, and
            same-day desk follow-up.
          </p>

          <div className="portal-bookings-summary">
            {activeEntries.map((entry) => (
              <div key={`${entry.customer}-${entry.time}`} className="portal-booking-item">
                <span>{entry.time}</span>
                <strong>{entry.customer}</strong>
                <span>{entry.service}</span>
                <span>{entry.note}</span>
              </div>
            ))}
          </div>

          <div className="portal-bookings-actions">
            <Link href="/portal/branches?role=staff" className="portal-primary-button">
              Open Branches
            </Link>
            <Link href="/portal?role=staff#support" className="portal-secondary-button">
              Open Support
            </Link>
            <Link href="/portal?role=staff" className="portal-secondary-button">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
