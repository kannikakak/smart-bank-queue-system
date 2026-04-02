"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ClockIcon, LocationIcon, ServiceIcon } from "@/shared/components/portal/PortalIcons";
import {
  getBranches,
  getStaffQueue,
  type BranchSummary,
  type StaffQueueTicket,
} from "@/shared/lib/api";

type BranchLoad = {
  branch: BranchSummary;
  booked: number;
  ready: number;
  inProgress: number;
};

export function StaffBranchesView() {
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [tickets, setTickets] = useState<StaffQueueTicket[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [branchData, queueData] = await Promise.all([
          getBranches(),
          getStaffQueue().catch(() => []),
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
            : "Unable to load branch readiness data.",
        );
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const branchLoads = useMemo<BranchLoad[]>(
    () =>
      branches.map((branch) => {
        const branchTickets = tickets.filter((ticket) => ticket.branch === branch.name);

        return {
          branch,
          booked: branchTickets.filter((ticket) => ticket.status === "WAITING").length,
          ready: branchTickets.filter((ticket) => ticket.status === "READY").length,
          inProgress: branchTickets.filter((ticket) => ticket.status === "IN_SERVICE").length,
        };
      }),
    [branches, tickets],
  );

  const busiestBranch = [...branchLoads].sort(
    (left, right) =>
      right.ready + right.inProgress + right.booked - (left.ready + left.inProgress + left.booked),
  )[0];

  return (
    <section className="branches-page">
      {errorMessage ? (
        <p className="auth-error-message" aria-live="polite">
          {errorMessage}
        </p>
      ) : null}

      <div className="branches-hero">
        <p className="branches-kicker">Branch readiness</p>
        <h1>See where appointments need staff attention</h1>
        <p>
          Use this view to understand branch readiness, active consultations, and which location
          needs support next.
        </p>
      </div>

      <div className="portal-bookings-panel">
        <div className="portal-bookings-header">
          <div>
            <p className="portal-services-kicker">Network overview</p>
            <h2>Branch consultation coverage</h2>
          </div>
          <span className="portal-booking-badge is-confirmed">
            {busiestBranch ? `${busiestBranch.branch.name} busiest now` : "Waiting for branch data"}
          </span>
        </div>

        <div className="portal-bookings-summary">
          <div className="portal-booking-item">
            <span>Branches visible</span>
            <strong>{branches.length}</strong>
          </div>
          <div className="portal-booking-item">
            <span>Booked</span>
            <strong>{branchLoads.reduce((sum, item) => sum + item.booked, 0)} scheduled</strong>
          </div>
          <div className="portal-booking-item">
            <span>Ready</span>
            <strong>{branchLoads.reduce((sum, item) => sum + item.ready, 0)} checked in</strong>
          </div>
          <div className="portal-booking-item">
            <span>In progress</span>
            <strong>{branchLoads.reduce((sum, item) => sum + item.inProgress, 0)} live sessions</strong>
          </div>
        </div>
      </div>

      <div className="branches-grid">
        {branchLoads.map(({ branch, booked, ready, inProgress }) => {
          const advisorCount = Math.max(branch.activeCounters, 1);

          return (
            <article key={branch.id} className="branch-card">
              <div className="branch-card-header">
                <h2>{branch.name}</h2>
                <span className="branch-badge">
                  {ready > 0 ? "Customers ready" : inProgress > 0 ? "In consultation" : "On track"}
                </span>
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
                <span>{branch.openingHours}</span>
              </div>

              <div className="branch-detail">
                <span className="branch-detail-icon" aria-hidden="true">
                  <ServiceIcon />
                </span>
                <span>{advisorCount} advisor{advisorCount === 1 ? "" : "s"} coordinating visits</span>
              </div>

              <p className="branch-card-note">
                {ready > 0
                  ? `${ready} customer${ready === 1 ? "" : "s"} already checked in and waiting for consultation.`
                  : booked > 0
                    ? `${booked} scheduled appointment${booked === 1 ? "" : "s"} still to arrive.`
                    : "No pending consultations at this branch right now."}
              </p>

              <div className="booking-spotlight-tags">
                <span>{booked} booked</span>
                <span>{ready} ready</span>
                <span>{inProgress} in progress</span>
              </div>

              <div className="branch-card-actions">
                <Link href="/portal/bookings?role=staff" className="portal-primary-button">
                  Review Appointments
                </Link>
                <Link href="/portal?role=staff" className="portal-secondary-button">
                  Return Home
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
