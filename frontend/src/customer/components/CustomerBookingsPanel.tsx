"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCustomerAppointments, type AppointmentSummary } from "@/shared/lib/api";
import { buildBookingsUrl, buildBranchesUrl, type BookingParams } from "@/shared/portal/booking-data";

type CustomerBookingsPanelProps = {
  params: BookingParams;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function getStatusTone(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus.includes("cancel")) {
    return "is-alert";
  }

  if (normalizedStatus.includes("complete")) {
    return "is-complete";
  }

  return "is-confirmed";
}

export function CustomerBookingsPanel({ params }: CustomerBookingsPanelProps) {
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const selectedAppointmentId = params.appointmentId ? Number(params.appointmentId) : null;

  useEffect(() => {
    let isMounted = true;

    async function loadAppointments() {
      try {
        const result = await getCustomerAppointments();

        if (!isMounted) {
          return;
        }

        setAppointments(result);
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error && error.message
            ? error.message
            : "Unable to load customer appointments.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort(
        (left, right) =>
          new Date(left.scheduledAt).getTime() - new Date(right.scheduledAt).getTime(),
      ),
    [appointments],
  );

  const nextAppointment = useMemo(() => {
    if (sortedAppointments.length === 0) {
      return null;
    }

    return (
      sortedAppointments.find((appointment) => appointment.id === selectedAppointmentId) ??
      sortedAppointments[0]
    );
  }, [selectedAppointmentId, sortedAppointments]);

  const upcomingCount = useMemo(
    () =>
      sortedAppointments.filter(
        (appointment) => new Date(appointment.scheduledAt).getTime() >= Date.now(),
      ).length,
    [sortedAppointments],
  );

  const bookingMetrics = [
    {
      label: "Appointments",
      value: String(sortedAppointments.length),
      detail: isLoading ? "Loading data" : "Stored in backend",
    },
    {
      label: "Upcoming",
      value: String(upcomingCount),
      detail: "Scheduled ahead",
    },
    {
      label: "Selected status",
      value: nextAppointment ? formatStatus(nextAppointment.status) : "Pending",
      detail: nextAppointment ? nextAppointment.branch : "No booking selected",
    },
  ];

  return (
    <section className="branches-page">
      <div className="branches-hero">
        <p className="branches-kicker">My Bookings</p>
        <h1>Your live appointments</h1>
        <p>
          Confirmed appointments now load from the backend instead of the URL query string.
        </p>
      </div>

      {errorMessage ? (
        <p className="auth-error-message" aria-live="polite">
          {errorMessage}
        </p>
      ) : null}

      <div className="portal-bookings-panel">
        <div className="portal-bookings-header">
          <div>
            <p className="portal-services-kicker">My Bookings</p>
            <h2>
              {isLoading
                ? "Loading appointments"
                : appointments.length > 0
                  ? "Appointments loaded"
                  : "No confirmed booking yet"}
            </h2>
          </div>
          <span
            className={`portal-booking-badge ${appointments.length > 0 ? "is-confirmed" : ""}`.trim()}
          >
            {isLoading ? "Loading" : appointments.length > 0 ? `${appointments.length} total` : "Pending"}
          </span>
        </div>

        <div className="portal-bookings-metrics">
          {bookingMetrics.map((metric) => (
            <article key={metric.label} className="portal-bookings-metric">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.detail}</small>
            </article>
          ))}
        </div>

        {nextAppointment ? (
          <div className="portal-bookings-layout">
            <div className="portal-bookings-card portal-bookings-card-primary">
              <div className="portal-bookings-lead">
                <div>
                  <p className="branches-kicker">Selected appointment</p>
                  <h3>{nextAppointment.service}</h3>
                  <p>{nextAppointment.branch}</p>
                </div>
                <span
                  className={`portal-booking-status ${getStatusTone(nextAppointment.status)}`.trim()}
                >
                  {formatStatus(nextAppointment.status)}
                </span>
              </div>

              <div className="portal-bookings-summary">
                <div className="portal-booking-item">
                  <span>Branch</span>
                  <strong>{nextAppointment.branch}</strong>
                </div>
                <div className="portal-booking-item">
                  <span>Service</span>
                  <strong>{nextAppointment.service}</strong>
                </div>
                <div className="portal-booking-item">
                  <span>Scheduled At</span>
                  <strong>{formatDateTime(nextAppointment.scheduledAt)}</strong>
                </div>
                <div className="portal-booking-item">
                  <span>Status</span>
                  <strong>{formatStatus(nextAppointment.status)}</strong>
                </div>
              </div>

              <div className="portal-bookings-actions">
                <Link
                  href={buildBranchesUrl("customer", {}, "branch-selection")}
                  className="portal-primary-button"
                >
                  Book Another Visit
                </Link>
              </div>
            </div>

            <aside className="portal-bookings-list">
              <div className="portal-bookings-list-head">
                <h3>Appointment history</h3>
                <p>Select an appointment to inspect its details.</p>
              </div>

              <div className="portal-bookings-list-items">
                {sortedAppointments.map((appointment) => (
                  <Link
                    key={appointment.id}
                    href={buildBookingsUrl("customer", {
                      ...params,
                      appointmentId: String(appointment.id),
                    })}
                    className={`portal-booking-list-item ${appointment.id === nextAppointment.id ? "is-active" : ""}`.trim()}
                  >
                    <div>
                      <strong>{appointment.service}</strong>
                      <span>{appointment.branch}</span>
                    </div>
                    <div>
                      <strong>{formatDateTime(appointment.scheduledAt)}</strong>
                      <span>{formatStatus(appointment.status)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        ) : (
          <div className="portal-bookings-empty">
            <p>
              Start with Branches, continue to Services, choose the time, and the confirmed booking
              will appear here after the backend creates it.
            </p>
            <div className="portal-bookings-actions">
              <Link
                href={buildBranchesUrl("customer", {}, "branch-selection")}
                className="portal-primary-button"
              >
                Start Booking
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
