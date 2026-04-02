"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  ServiceIcon,
} from "@/shared/components/portal/PortalIcons";
import {
  checkInStaffAppointment,
  completeStaffAppointment,
  getStaffAppointmentDetail,
  getStaffQueue,
  startStaffAppointment,
  type StaffAppointmentDetail,
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

function formatStatusLabel(status: string) {
  if (status === "READY") {
    return "Checked In";
  }

  if (status === "IN_SERVICE") {
    return "In Consultation";
  }

  return "Booked";
}

function getStatusTone(status: string) {
  if (status === "READY") {
    return "is-confirmed";
  }

  if (status === "IN_SERVICE") {
    return "is-upcoming";
  }

  return "";
}

function getPrimaryAction(status: string) {
  if (status === "WAITING") {
    return "Check In";
  }

  if (status === "READY") {
    return "Start Consultation";
  }

  if (status === "IN_SERVICE") {
    return "Complete";
  }

  return null;
}

export function StaffBookingsView() {
  const [tickets, setTickets] = useState<StaffQueueTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<StaffAppointmentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [activityMessage, setActivityMessage] = useState("Loading assigned appointments...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadQueue(preferredId?: number | null) {
    try {
      const queueData = await getStaffQueue();
      setTickets(queueData);

      const nextId =
        preferredId && queueData.some((ticket) => ticket.appointmentId === preferredId)
          ? preferredId
          : queueData[0]?.appointmentId ?? null;

      setSelectedTicketId(nextId);
      setErrorMessage(null);
      setActivityMessage(
        queueData.length > 0
          ? "Live appointment board synced with assigned staff actions."
          : "No assigned appointments right now.",
      );
      return nextId;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Unable to load staff appointments.";
      setErrorMessage(message);
      setActivityMessage(message);
      setTickets([]);
      setSelectedTicketId(null);
      setSelectedTicket(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadQueue();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDetail() {
      if (!selectedTicketId) {
        setSelectedTicket(null);
        return;
      }

      try {
        setIsDetailLoading(true);
        const detail = await getStaffAppointmentDetail(selectedTicketId);

        if (!isMounted) {
          return;
        }

        setSelectedTicket(detail);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setSelectedTicket(null);
        setErrorMessage(
          error instanceof Error && error.message
            ? error.message
            : "Unable to load appointment details.",
        );
      } finally {
        if (isMounted) {
          setIsDetailLoading(false);
        }
      }
    }

    void loadDetail();

    return () => {
      isMounted = false;
    };
  }, [selectedTicketId]);

  async function handlePrimaryAction(ticket: StaffQueueTicket) {
    const action = getPrimaryAction(ticket.status);

    if (!action) {
      return;
    }

    try {
      setActionId(ticket.appointmentId);

      if (ticket.status === "WAITING") {
        await checkInStaffAppointment(ticket.appointmentId);
        setActivityMessage(`${ticket.customerName} checked in successfully.`);
      } else if (ticket.status === "READY") {
        await startStaffAppointment(ticket.appointmentId);
        setActivityMessage(`${ticket.customerName} moved into consultation.`);
      } else if (ticket.status === "IN_SERVICE") {
        await completeStaffAppointment(ticket.appointmentId);
        setActivityMessage(`${ticket.customerName}'s consultation was completed.`);
      }

      const nextId = await loadQueue(ticket.appointmentId);

      if (nextId) {
        const detail = await getStaffAppointmentDetail(nextId);
        setSelectedTicket(detail);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "Unable to update the appointment.",
      );
    } finally {
      setActionId(null);
    }
  }

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

  return (
    <section className="branches-page">
      {errorMessage ? (
        <p className="auth-error-message" aria-live="polite">
          {errorMessage}
        </p>
      ) : null}

      <div className="branches-hero">
        <p className="branches-kicker">Appointment board</p>
        <h1>Manage customer consultations in real time</h1>
        <p>
          Review arrivals, update appointment status, and keep each consultation moving with clear
          staff actions.
        </p>
      </div>

      <div className="portal-bookings-panel">
        <div className="portal-bookings-header">
          <div>
            <p className="portal-services-kicker">Staff actions</p>
            <h2>Assigned appointment board</h2>
          </div>
          <span className={`portal-booking-badge ${readyCount > 0 ? "is-confirmed" : ""}`.trim()}>
            {readyCount > 0 ? "Action needed" : "Schedule under control"}
          </span>
        </div>

        <div className="portal-bookings-summary">
          <div className="portal-booking-item">
            <span>Booked</span>
            <strong>{bookedCount} scheduled</strong>
          </div>
          <div className="portal-booking-item">
            <span>Checked in</span>
            <strong>{readyCount} ready</strong>
          </div>
          <div className="portal-booking-item">
            <span>In consultation</span>
            <strong>{inProgressCount} active</strong>
          </div>
          <div className="portal-booking-item">
            <span>Next arrival</span>
            <strong>{nextArrival ? formatDateTime(nextArrival.scheduledAt) : "No upcoming visit"}</strong>
          </div>
        </div>
      </div>

      <div className="staff-board-layout">
        <div className="staff-board-list">
          <div className="staff-board-head">
            <div>
              <p className="portal-services-kicker">Today&apos;s workload</p>
              <h2>Appointments requiring follow-up</h2>
            </div>
            <p>{activityMessage}</p>
          </div>

          {isLoading ? (
            <div className="booking-empty-state">Loading assigned appointments...</div>
          ) : sortedTickets.length === 0 ? (
            <div className="booking-empty-state">
              No assigned appointments right now. New bookings will appear here when staff are notified.
            </div>
          ) : (
            <div className="staff-ticket-list">
              {sortedTickets.map((ticket) => {
                const primaryAction = getPrimaryAction(ticket.status);

                return (
                  <article
                    key={ticket.appointmentId}
                    className={`staff-ticket-card ${selectedTicketId === ticket.appointmentId ? "is-selected" : ""}`.trim()}
                  >
                    <button
                      type="button"
                      className="staff-ticket-select"
                      onClick={() => setSelectedTicketId(ticket.appointmentId)}
                    >
                      <div className="staff-ticket-top">
                        <span className="staff-ticket-reference">{ticket.ticketNumber}</span>
                        <span className={`portal-booking-badge ${getStatusTone(ticket.status)}`.trim()}>
                          {formatStatusLabel(ticket.status)}
                        </span>
                      </div>

                      <div className="staff-ticket-copy">
                        <strong>{ticket.customerName}</strong>
                        <p>{ticket.service}</p>
                      </div>

                      <div className="staff-ticket-meta">
                        <span>
                          <ClockIcon />
                          {formatDateTime(ticket.scheduledAt)}
                        </span>
                        <span>
                          <CalendarIcon />
                          {ticket.branch}
                        </span>
                      </div>
                    </button>

                    {primaryAction ? (
                      <button
                        type="button"
                        className="portal-primary-button staff-ticket-action"
                        onClick={() => void handlePrimaryAction(ticket)}
                        disabled={actionId === ticket.appointmentId}
                      >
                        {actionId === ticket.appointmentId ? "Updating..." : primaryAction}
                      </button>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="staff-board-sidebar">
          <div className="staff-detail-card">
            <div className="staff-detail-head">
              <p className="portal-services-kicker">Appointment detail</p>
              <h2>{selectedTicket ? selectedTicket.customerName : "Select an appointment"}</h2>
            </div>

            {isDetailLoading ? (
              <div className="booking-empty-state">Loading appointment detail...</div>
            ) : selectedTicket ? (
              <>
                <div className="staff-detail-grid">
                  <div className="staff-detail-item">
                    <span>Service</span>
                    <strong>{selectedTicket.service}</strong>
                  </div>
                  <div className="staff-detail-item">
                    <span>Status</span>
                    <strong>{formatStatusLabel(selectedTicket.status)}</strong>
                  </div>
                  <div className="staff-detail-item">
                    <span>Branch</span>
                    <strong>{selectedTicket.branch}</strong>
                  </div>
                  <div className="staff-detail-item">
                    <span>Assigned staff</span>
                    <strong>{selectedTicket.assignedStaff ?? "Branch team"}</strong>
                  </div>
                </div>

                <div className="staff-detail-timeline">
                  <div className="staff-detail-timeline-item">
                    <ClockIcon />
                    <div>
                      <span>Scheduled</span>
                      <strong>{formatDateTime(selectedTicket.scheduledAt)}</strong>
                    </div>
                  </div>
                  <div className="staff-detail-timeline-item">
                    <CheckIcon />
                    <div>
                      <span>Check-in</span>
                      <strong>
                        {selectedTicket.checkedInAt
                          ? formatDateTime(selectedTicket.checkedInAt)
                          : "Waiting for arrival"}
                      </strong>
                    </div>
                  </div>
                  <div className="staff-detail-timeline-item">
                    <ServiceIcon />
                    <div>
                      <span>Consultation</span>
                      <strong>
                        {selectedTicket.serviceStartAt
                          ? `Started ${formatDateTime(selectedTicket.serviceStartAt)}`
                          : "Not started yet"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="portal-bookings-actions">
                  <Link href="/portal/branches?role=staff" className="portal-secondary-button">
                    Review Branches
                  </Link>
                  <Link href="/portal?role=staff#support" className="portal-secondary-button">
                    Support
                  </Link>
                </div>
              </>
            ) : (
              <div className="booking-empty-state">
                Select an appointment to review customer, timing, and consultation details.
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
