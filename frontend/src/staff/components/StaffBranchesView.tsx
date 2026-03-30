import Link from "next/link";
import { ClockIcon, LocationIcon, QueueIcon } from "@/shared/components/portal/PortalIcons";

type StaffBranch = {
  id: string;
  name: string;
  address: string;
  hours: string;
  queue: string;
  note: string;
};

const staffBranches: StaffBranch[] = [
  {
    id: "front-counter",
    name: "Front Counter Desk",
    address: "Main Customer Hall",
    hours: "08:00 - 17:00",
    queue: "Customer onboarding and cash services",
    note: "Best for customer greeting, queue control, and basic service routing.",
  },
  {
    id: "advisory-desk",
    name: "Advisory Service Desk",
    address: "Consultation Zone",
    hours: "08:30 - 17:30",
    queue: "Loans, account help, and scheduled consultations",
    note: "Coordinate with advisors and confirm scheduled customer visits.",
  },
  {
    id: "priority-counter",
    name: "Priority Counter",
    address: "Priority Service Area",
    hours: "08:00 - 18:00",
    queue: "Priority and fast-lane customers",
    note: "Keep appointments on time and reduce waiting time for selected services.",
  },
];

export function StaffBranchesView() {
  return (
    <section className="branches-page">
      <div className="branches-hero">
        <p className="branches-kicker">Staff branch view</p>
        <h1>See service desks and branch coverage</h1>
        <p>Use this view to understand where support is needed and which desks are active now.</p>
      </div>

      <div className="branches-grid">
        {staffBranches.map((branch) => (
          <article key={branch.id} className="branch-card">
            <div className="branch-card-header">
              <h2>{branch.name}</h2>
              <span className="branch-badge">Staff</span>
            </div>

            <div className="branch-detail">
              <span className="branch-detail-icon" aria-hidden="true">
                <LocationIcon />
              </span>
              <span>{branch.address}</span>
            </div>

            <div className="branch-detail">
              <span className="branch-detail-icon" aria-hidden="true">
                <ClockIcon />
              </span>
              <span>{branch.hours}</span>
            </div>

            <div className="branch-detail">
              <span className="branch-detail-icon" aria-hidden="true">
                <QueueIcon />
              </span>
              <span>{branch.queue}</span>
            </div>

            <p className="branch-card-note">{branch.note}</p>

            <div className="branch-card-actions">
              <Link href="/portal/bookings?role=staff" className="portal-primary-button">
                Review Bookings
              </Link>
              <Link href="/portal?role=staff" className="portal-secondary-button">
                Return Home
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
