"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PortalSectionHeader } from "@/shared/components/portal/PortalSectionHeader";
import {
  CalendarIcon,
  ChatIcon,
  CheckIcon,
  ClockIcon,
  HelpIcon,
  PhoneIcon,
  ServiceIcon,
} from "@/shared/components/portal/PortalIcons";
import {
  getBranches,
  getStaffQueue,
  type BranchSummary,
  type StaffQueueTicket,
} from "@/shared/lib/api";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function StaffPortalHome() {
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [tickets, setTickets] = useState<StaffQueueTicket[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [branchData, queueData] = await Promise.all([
          getBranches().catch(() => []),
          getStaffQueue(),
        ]);

        if (!isMounted) {
          return;
        }

        setBranches(branchData);
        setTickets(queueData);
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error && error.message
            ? error.message
            : "Unable to load the staff workspace.",
        );
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedTickets = useMemo(
    () =>
      [...tickets].sort(
        (left, right) =>
          new Date(left.scheduledAt).getTime() - new Date(right.scheduledAt).getTime(),
      ),
    [tickets],
  );
  const bookedCount = sortedTickets.filter((ticket) => ticket.status === "WAITING").length;
  const readyCount = sortedTickets.filter((ticket) => ticket.status === "READY").length;
  const inProgressCount = sortedTickets.filter((ticket) => ticket.status === "IN_SERVICE").length;
  const nextArrival = sortedTickets[0];
  const readyArrival = sortedTickets.find((ticket) => ticket.status === "READY");
  const followUpBranch = readyArrival?.branch ?? nextArrival?.branch ?? branches[0]?.name ?? "Central Branch";

  const workflowCards = [
    {
      title: "Review today’s schedule",
      description:
        sortedTickets.length > 0
          ? `${sortedTickets.length} appointments are already assigned for follow-up today.`
          : "No assigned appointments yet. New bookings will appear here automatically.",
      action: "Open Appointment Board",
      href: "/portal/bookings?role=staff",
      icon: <CalendarIcon />,
    },
    {
      title: "Prepare arriving customers",
      description:
        readyCount > 0
          ? `${readyCount} customer${readyCount === 1 ? "" : "s"} checked in and waiting for consultation.`
          : "No customers are checked in yet. Use the board to monitor arrivals.",
      action: "View Ready Appointments",
      href: "/portal/bookings?role=staff",
      icon: <CheckIcon />,
    },
    {
      title: "Coordinate branch support",
      description:
        branches.length > 0
          ? `${branches.length} branches are visible for branch readiness and service planning.`
          : "Branch data will appear here when the backend is available.",
      action: "Open Branch Readiness",
      href: "/portal/branches?role=staff",
      icon: <ServiceIcon />,
    },
  ] as const;

  const supportCards = [
    {
      title: "Customer preparation guide",
      description:
        "Review document readiness, advisor assignment, and arrival timing before the consultation starts.",
      action: "Open Appointment Board",
      href: "/portal/bookings?role=staff",
      icon: <HelpIcon />,
    },
    {
      title: "Escalate a branch issue",
      description:
        "Use the support section when a customer needs reassignment, a specialist, or same-day recovery help.",
      action: "Open Support",
      href: "/portal?role=staff#support",
      icon: <PhoneIcon />,
    },
    {
      title: "Share handoff notes",
      description:
        "Keep the branch team aligned on checked-in customers, consultation timing, and follow-up actions.",
      action: "Review Branches",
      href: "/portal/branches?role=staff",
      icon: <ChatIcon />,
    },
  ] as const;

  const upcomingTickets = sortedTickets.slice(0, 4);

  return (
    <section className="branches-page">
      {errorMessage ? (
        <p className="auth-error-message" aria-live="polite">
          {errorMessage}
        </p>
      ) : null}

      <div className="branches-hero">
        <p className="branches-kicker">Staff workspace</p>
        <h1>Run the branch around appointments, not walk-in waiting</h1>
        <p>
          Prepare arrivals, confirm check-ins, and move consultations forward from one staff-ready
          workspace.
        </p>
      </div>

      <section className="portal-bookings-panel">
        <div className="portal-bookings-header">
          <div>
            <p className="portal-services-kicker">Shift snapshot</p>
            <h2>Today&apos;s consultation flow</h2>
          </div>
          <span className="portal-booking-badge is-confirmed">
            {readyCount > 0 ? "Customers ready" : "Monitoring arrivals"}
          </span>
        </div>

        <div className="portal-bookings-summary">
          <div className="portal-booking-item">
            <span>Booked today</span>
            <strong>{bookedCount} scheduled</strong>
          </div>
          <div className="portal-booking-item">
            <span>Ready now</span>
            <strong>{readyCount} checked in</strong>
          </div>
          <div className="portal-booking-item">
            <span>In progress</span>
            <strong>{inProgressCount} consultation{inProgressCount === 1 ? "" : "s"}</strong>
          </div>
          <div className="portal-booking-item">
            <span>Next arrival</span>
            <strong>{nextArrival ? formatDateTime(nextArrival.scheduledAt) : "No upcoming visit"}</strong>
          </div>
        </div>

        <div className="portal-bookings-card">
          <p>
            {readyArrival
              ? `${readyArrival.customerName} is ready at ${readyArrival.branch}. Prepare the ${readyArrival.service.toLowerCase()} consultation next.`
              : `Use this workspace to stay ahead of arrivals at ${followUpBranch} and keep staff preparation tight.`}
          </p>

          <div className="portal-bookings-summary">
            {upcomingTickets.length > 0 ? (
              upcomingTickets.map((ticket) => (
                <div key={ticket.appointmentId} className="portal-booking-item">
                  <span>{formatTime(ticket.scheduledAt)}</span>
                  <strong>{ticket.customerName}</strong>
                  <span>{ticket.service}</span>
                  <span>
                    {ticket.status === "READY"
                      ? "Checked in and ready"
                      : ticket.status === "IN_SERVICE"
                        ? "Consultation in progress"
                        : `Assigned to ${ticket.assignedStaff ?? "branch staff"}`}
                  </span>
                </div>
              ))
            ) : (
              <div className="portal-booking-item">
                <span>No assigned appointments</span>
                <strong>Branch schedule is clear</strong>
                <span>New bookings will appear here when they are assigned to staff.</span>
              </div>
            )}
          </div>

          <div className="portal-bookings-actions">
            <Link href="/portal/bookings?role=staff" className="portal-primary-button">
              Open Appointment Board
            </Link>
            <Link href="/portal/branches?role=staff" className="portal-secondary-button">
              Review Branches
            </Link>
            <Link href="/portal?role=staff#support" className="portal-secondary-button">
              Open Support
            </Link>
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
          description="Keep appointment preparation, branch handoff, and same-day recovery aligned from one support section."
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
              Arrival readiness, document checks, advisor handoff, specialist escalation, and
              follow-up notes after each consultation.
            </p>
          </div>
          <div className="portal-support-tags">
            <span>{bookedCount} booked</span>
            <span>{readyCount} ready</span>
            <span>{inProgressCount} in progress</span>
            <span>{branches.length || 0} branches</span>
          </div>
        </div>
      </section>
    </section>
  );
}
