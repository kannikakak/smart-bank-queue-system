import Link from "next/link";
import { PortalSectionHeader } from "@/shared/components/portal/PortalSectionHeader";
import {
  ChatIcon,
  ClockIcon,
  HelpIcon,
  PhoneIcon,
  QueueIcon,
  ServiceIcon,
} from "@/shared/components/portal/PortalIcons";

const workflowCards = [
  {
    title: "Check service desks",
    description:
      "Review which counters are live, where the queue is rising, and which desk needs support first.",
    action: "Open Branches",
    href: "/portal/branches?role=staff",
    icon: <QueueIcon />,
  },
  {
    title: "Review appointments",
    description:
      "Track today's arrivals, confirm check-ins, and keep scheduled customers aligned with staff availability.",
    action: "View Appointments",
    href: "/portal/bookings?role=staff",
    icon: <ClockIcon />,
  },
  {
    title: "Handle service support",
    description:
      "Use one staff workspace for front-desk follow-up, queue recovery, and same-day escalations.",
    action: "Open Support",
    href: "/portal?role=staff#support",
    icon: <ServiceIcon />,
  },
] as const;

const supportCards = [
  {
    title: "Desk escalation guide",
    description:
      "Review what to do when queues are delayed, customers are missing documents, or counters need handoff support.",
    action: "Open Help Section",
    href: "/portal?role=staff#support",
    icon: <HelpIcon />,
  },
  {
    title: "Call operations lead",
    description:
      "Use the staff support page as the handoff point for urgent queue balancing and desk reassignment.",
    action: "Review Support Steps",
    href: "/portal?role=staff#support",
    icon: <PhoneIcon />,
  },
  {
    title: "Shift coordination",
    description:
      "Share desk coverage updates, late arrivals, and customer handoff details with the branch team.",
    action: "View Appointments",
    href: "/portal/bookings?role=staff",
    icon: <ChatIcon />,
  },
] as const;

export function StaffPortalHome() {
  return (
    <section className="branches-page">
      <div className="branches-hero">
        <p className="branches-kicker">Staff access</p>
        <h1>Support daily branch service operations</h1>
        <p>
          Follow appointments, handle customer check-ins, and keep counters moving during branch
          hours.
        </p>
      </div>

      <section className="portal-bookings-panel">
        <div className="portal-bookings-header">
          <div>
            <p className="portal-services-kicker">Shift snapshot</p>
            <h2>Today&apos;s branch focus</h2>
          </div>
          <span className="portal-booking-badge is-confirmed">Live board</span>
        </div>

        <div className="portal-bookings-summary">
          <div className="portal-booking-item">
            <span>Active desks</span>
            <strong>6 counters online</strong>
          </div>
          <div className="portal-booking-item">
            <span>Next priority</span>
            <strong>11:15 AM loan consultation</strong>
          </div>
          <div className="portal-booking-item">
            <span>Queue watch</span>
            <strong>Midday walk-in volume rising</strong>
          </div>
          <div className="portal-booking-item">
            <span>Team note</span>
            <strong>Front counter needs extra coverage at noon</strong>
          </div>
        </div>
      </section>

      <div className="portal-process-grid">
        {workflowCards.map((card) => (
          <article key={card.title} className="portal-process-card">
            <span className="portal-process-icon" aria-hidden="true">
              {card.icon}
            </span>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <Link href={card.href} className="portal-process-link">
              {card.action}
            </Link>
          </article>
        ))}
      </div>

      <section className="portal-support-shell" id="support">
        <PortalSectionHeader
          kicker="Support"
          title="Staff support and escalation"
          description="Keep desk coverage, queue handoffs, and customer follow-up aligned from one clear support section."
          variant="support"
        />

        <div className="portal-support-grid">
          {supportCards.map((card) => (
            <article key={card.title} className="portal-support-card">
              <span className="portal-support-card-icon" aria-hidden="true">
                {card.icon}
              </span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link href={card.href} className="portal-support-link">
                {card.action}
              </Link>
            </article>
          ))}
        </div>

        <div className="portal-support-panel">
          <div>
            <strong>What staff support should cover</strong>
            <p>
              Queue balancing, delayed appointments, counter reassignment, document readiness, and
              customer handoff notes.
            </p>
          </div>
          <div className="portal-support-tags">
            <span>Queue recovery</span>
            <span>Desk handoff</span>
            <span>Customer follow-up</span>
            <span>Shift support</span>
          </div>
        </div>
      </section>
    </section>
  );
}
