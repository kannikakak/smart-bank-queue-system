"use client";

import {
  useDeferredValue,
  useEffect,
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  appointmentScheduleEntries,
  completedAppointments,
  type AppointmentScheduleEntry,
  type CompletedAppointmentEntry,
} from "@/admin/lib/workspace-data";

type ViewMode = "list" | "calendar";
type AppointmentStatus = AppointmentScheduleEntry["status"];
type FilterStatus = AppointmentStatus | "all";

type AppointmentDraft = {
  customer: string;
  email: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  note: string;
  status: AppointmentStatus;
  priority: boolean;
};

const fallbackDate = appointmentScheduleEntries[0]?.date ?? "2026-03-15";

function createEmptyDraft(date = fallbackDate): AppointmentDraft {
  return {
    customer: "",
    email: "",
    service: "",
    date,
    time: "09:00",
    duration: "30",
    note: "",
    status: "scheduled",
    priority: false,
  };
}

function toMinutes(time: string) {
  const [clock, meridiem] = time.split(" ");
  const [rawHours, rawMinutes] = clock.split(":").map(Number);
  let hours = rawHours;

  if (meridiem === "PM" && rawHours !== 12) hours += 12;
  if (meridiem === "AM" && rawHours === 12) hours = 0;

  return hours * 60 + rawMinutes;
}

function sortAppointments(list: AppointmentScheduleEntry[]) {
  return [...list].sort((left, right) => {
    const dateOrder = left.date.localeCompare(right.date);
    if (dateOrder !== 0) return dateOrder;

    const timeOrder = toMinutes(left.time) - toMinutes(right.time);
    if (timeOrder !== 0) return timeOrder;

    return left.customer.localeCompare(right.customer);
  });
}

function sortCompleted(list: CompletedAppointmentEntry[]) {
  return [...list].sort((left, right) => {
    const dateOrder = right.date.localeCompare(left.date);
    if (dateOrder !== 0) return dateOrder;

    return toMinutes(right.time) - toMinutes(left.time);
  });
}

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function toDisplayTime(time: string) {
  const [hoursText, minutesText] = time.split(":");
  const hours = Number(hoursText);
  const normalizedHours = hours % 12 || 12;
  const meridiem = hours >= 12 ? "PM" : "AM";
  return `${normalizedHours}:${minutesText} ${meridiem}`;
}

function toInputTime(time: string) {
  const [clock, meridiem] = time.split(" ");
  const [rawHours, rawMinutes] = clock.split(":").map(Number);
  let hours = rawHours;

  if (meridiem === "PM" && rawHours !== 12) hours += 12;
  if (meridiem === "AM" && rawHours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${rawMinutes.toString().padStart(2, "0")}`;
}

function stripDuration(duration: string) {
  return duration.replace(/[^0-9]/g, "") || "30";
}

function normalizeDuration(duration: string) {
  return `${duration.replace(/[^0-9]/g, "") || "30"}m`;
}

function buildDraft(appointment: AppointmentScheduleEntry): AppointmentDraft {
  return {
    customer: appointment.customer,
    email: appointment.email,
    service: appointment.service,
    date: appointment.date,
    time: toInputTime(appointment.time),
    duration: stripDuration(appointment.duration),
    note: appointment.note,
    status: appointment.status,
    priority: appointment.priority === "priority",
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getNextReference(active: AppointmentScheduleEntry[], completed: CompletedAppointmentEntry[]) {
  const nextNumber =
    [...active.map((item) => item.reference), ...completed.map((item) => item.reference)].reduce(
      (largest, reference) => {
        const match = reference.match(/(\d+)/);
        return Math.max(largest, match ? Number(match[1]) : 0);
      },
      9000,
    ) + 1;

  return `SQ-${nextNumber}`;
}

function formatStatusLabel(status: AppointmentStatus) {
  return status === "checked-in" ? "Checked In" : "Scheduled";
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0-2a8.5 8.5 0 1 0 5.33 15.12l4.02 4.03 1.42-1.42-4.03-4.02A8.5 8.5 0 0 0 10.5 2Z" fill="currentColor" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 2h2v2h6V2h2v2h1.5A2.5 2.5 0 0 1 21 6.5v12A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5v-12A2.5 2.5 0 0 1 5.5 4H7V2Zm12 8h-14v8.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V10Z" fill="currentColor" />
    </svg>
  );
}

function ServiceIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v9A2.5 2.5 0 0 1 17.5 17H8.4L5 20.2V17.5A2.5 2.5 0 0 1 3 15V5.5Zm4 1.5v2h8V7H8Zm0 4v2h5v-2H8Z" fill="currentColor" />
    </svg>
  );
}

function StatusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm3.85 6.35-4.54 4.92-2.16-2.16-1.42 1.42 3.64 3.64 5.95-6.45-1.47-1.37Z" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 4h-2v6l4.4 2.64 1-1.64-3.4-2V7Z" fill="currentColor" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4 6.4 5Z" fill="currentColor" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm4.3 6.8-5.13 5.56-2.47-2.48-1.42 1.41 3.94 3.95 6.55-7.11-1.47-1.33Z" fill="currentColor" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v8h-2V9Zm4 0h2v8h-2V9ZM7 9h2v8H7V9Zm-1 12h12a2 2 0 0 0 2-2V8H4v11a2 2 0 0 0 2 2Z" fill="currentColor" />
    </svg>
  );
}

export function AdminAppointmentsWorkspace() {
  const [appointments, setAppointments] = useState(() => sortAppointments(appointmentScheduleEntries));
  const [completed, setCompleted] = useState(() => sortCompleted(completedAppointments));
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedDate, setSelectedDate] = useState(fallbackDate);
  const [selectedService, setSelectedService] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm.trim().toLowerCase());
  const [activityNote, setActivityNote] = useState("This is a local front-end workspace. Refresh resets changes.");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingReference, setEditingReference] = useState<string | null>(null);
  const [draft, setDraft] = useState<AppointmentDraft>(() => createEmptyDraft(fallbackDate));
  const [menuReference, setMenuReference] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsComposerOpen(false);
        setMenuReference(null);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const services = Array.from(new Set(appointments.map((item) => item.service))).sort((left, right) =>
    left.localeCompare(right),
  );

  const activeForDate = sortAppointments(appointments.filter((item) => item.date === selectedDate));
  const filteredAppointments = activeForDate.filter((item) => {
    const serviceMatch = selectedService === "all" || item.service === selectedService;
    const statusMatch = selectedStatus === "all" || item.status === selectedStatus;
    const searchMatch =
      deferredSearch.length === 0 ||
      [item.customer, item.email, item.reference, item.service, item.note]
        .join(" ")
        .toLowerCase()
        .includes(deferredSearch);

    return serviceMatch && statusMatch && searchMatch;
  });

  const filteredCompleted = sortCompleted(
    completed.filter((item) => {
      const serviceMatch = selectedService === "all" || item.service === selectedService;
      const searchMatch =
        deferredSearch.length === 0 ||
        [item.customer, item.reference, item.service].join(" ").toLowerCase().includes(deferredSearch);

      return item.date === selectedDate && serviceMatch && searchMatch;
    }),
  );

  const scheduledCount = activeForDate.filter((item) => item.status === "scheduled").length;
  const checkedInCount = activeForDate.filter((item) => item.status === "checked-in").length;
  const nextAppointment = activeForDate[0];
  const nextSlot = nextAppointment?.time ?? "No slots";
  const priorityCount = activeForDate.filter((item) => item.priority === "priority").length;

  function openCreate() {
    setEditingReference(null);
    setDraft(createEmptyDraft(selectedDate));
    setIsComposerOpen(true);
    setMenuReference(null);
  }

  function openEdit(appointment: AppointmentScheduleEntry) {
    setEditingReference(appointment.reference);
    setDraft(buildDraft(appointment));
    setIsComposerOpen(true);
    setMenuReference(null);
  }

  function closeComposer() {
    setIsComposerOpen(false);
    setEditingReference(null);
  }

  function handleDraftChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setDraft((currentDraft) => ({
      ...currentDraft,
      [name]:
        event.target instanceof HTMLInputElement && event.target.type === "checkbox"
          ? event.target.checked
          : value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextAppointment: AppointmentScheduleEntry = {
      reference: editingReference ?? getNextReference(appointments, completed),
      customer: draft.customer.trim(),
      email: draft.email.trim(),
      service: draft.service.trim(),
      date: draft.date,
      time: toDisplayTime(draft.time),
      duration: normalizeDuration(draft.duration),
      note: draft.note.trim(),
      status: draft.status,
      priority: draft.priority ? "priority" : undefined,
    };

    startTransition(() => {
      setAppointments((currentAppointments) =>
        sortAppointments(
          editingReference
            ? currentAppointments.map((item) => (item.reference === editingReference ? nextAppointment : item))
            : [nextAppointment, ...currentAppointments],
        ),
      );
      setSelectedDate(nextAppointment.date);
      setActivityNote(
        editingReference
          ? `Updated ${nextAppointment.customer}'s appointment.`
          : `Added ${nextAppointment.customer} for ${formatDateLabel(nextAppointment.date)}.`,
      );
    });

    closeComposer();
  }

  function handlePrimaryAction(appointment: AppointmentScheduleEntry) {
    setMenuReference(null);

    if (appointment.status === "scheduled") {
      startTransition(() => {
        setAppointments((currentAppointments) =>
          sortAppointments(
            currentAppointments.map((item) =>
              item.reference === appointment.reference ? { ...item, status: "checked-in" } : item,
            ),
          ),
        );
        setActivityNote(`${appointment.customer} checked in successfully.`);
      });
      return;
    }

    startTransition(() => {
      setAppointments((currentAppointments) =>
        currentAppointments.filter((item) => item.reference !== appointment.reference),
      );
      setCompleted((currentCompleted) =>
        sortCompleted([
          {
            reference: appointment.reference,
            customer: appointment.customer,
            date: appointment.date,
            time: appointment.time,
            service: appointment.service,
            summaryLabel: "View Summary",
          },
          ...currentCompleted,
        ]),
      );
      setActivityNote(`${appointment.customer}'s appointment moved to completed.`);
    });
  }

  function handleDuplicate(appointment: AppointmentScheduleEntry) {
    const duplicate: AppointmentScheduleEntry = {
      ...appointment,
      reference: getNextReference(appointments, completed),
      status: "scheduled",
      note: `${appointment.note} (Follow-up)`,
      priority: undefined,
    };

    startTransition(() => {
      setAppointments((currentAppointments) => sortAppointments([duplicate, ...currentAppointments]));
      setActivityNote(`Duplicated ${appointment.customer}'s appointment.`);
    });

    setMenuReference(null);
  }

  function handleDelete(appointment: AppointmentScheduleEntry) {
    if (!window.confirm(`Delete ${appointment.customer}'s appointment?`)) {
      return;
    }

    startTransition(() => {
      setAppointments((currentAppointments) =>
        currentAppointments.filter((item) => item.reference !== appointment.reference),
      );
      setActivityNote(`Deleted ${appointment.customer}'s appointment.`);
    });

    setMenuReference(null);
  }

  function handleCompletedDelete(appointment: CompletedAppointmentEntry) {
    if (!window.confirm(`Remove ${appointment.customer} from completed history?`)) {
      return;
    }

    startTransition(() => {
      setCompleted((currentCompleted) =>
        currentCompleted.filter((item) => item.reference !== appointment.reference),
      );
      setActivityNote(`Removed ${appointment.customer} from completed history.`);
    });
  }

  return (
    <section className="admin-appointments-page">
      <div className="admin-appointments-hero">
        <div className="admin-appointments-intro">
          <div className="admin-appointments-intro-copy">
            <p className="admin-appointments-kicker">Front Desk Schedule</p>
            <h2>Appointments</h2>
            <p>Manage walk-ins, scheduled service visits, and check-ins from one balanced workspace.</p>
          </div>

          <div className="admin-appointments-hero-metrics" aria-label="Daily schedule summary">
            <article className="admin-appointments-hero-metric">
              <span>Board Load</span>
              <strong>{activeForDate.length}</strong>
              <p>Appointments on {formatDateLabel(selectedDate)}</p>
            </article>
            <article className="admin-appointments-hero-metric">
              <span>Checked In</span>
              <strong>{checkedInCount}</strong>
              <p>Customers ready for service</p>
            </article>
            <article className="admin-appointments-hero-metric">
              <span>Priority</span>
              <strong>{priorityCount}</strong>
              <p>Priority slots requiring attention</p>
            </article>
          </div>
        </div>

        <div className="admin-appointments-spotlight">
          <div className="admin-appointments-spotlight-copy">
            <span>Today</span>
            <strong>{formatDateLabel(selectedDate)}</strong>
            <p>{activeForDate.length} active appointments on the board.</p>
          </div>

          <div className="admin-appointments-spotlight-grid">
            <div className="admin-appointments-spotlight-stat">
              <span>Next Arrival</span>
              <strong>{nextSlot}</strong>
              <p>{nextAppointment?.customer ?? "No upcoming customer"}</p>
            </div>
            <div className="admin-appointments-spotlight-stat">
              <span>Completed</span>
              <strong>{filteredCompleted.length}</strong>
              <p>Appointments closed for this day</p>
            </div>
          </div>

          <button type="button" className="admin-appointments-create" onClick={openCreate}>
            <PlusIcon />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      <div className="admin-appointments-summary-grid">
        <article className="admin-appointments-summary-card is-scheduled">
          <span>Scheduled</span>
          <strong>{scheduledCount}</strong>
          <p>{formatDateLabel(selectedDate)}</p>
        </article>
        <article className="admin-appointments-summary-card is-checked-in">
          <span>Checked In</span>
          <strong>{checkedInCount}</strong>
          <p>Live queue ready</p>
        </article>
        <article className="admin-appointments-summary-card is-completed">
          <span>Completed</span>
          <strong>{filteredCompleted.length}</strong>
          <p>Stored locally</p>
        </article>
        <article className="admin-appointments-summary-card is-accent">
          <span>Next Slot</span>
          <strong>{nextSlot}</strong>
          <p>{activeForDate[0]?.customer ?? "No appointments"}</p>
        </article>
      </div>

      <div className="admin-appointments-toolbar">
        <div className="admin-appointments-toolbar-top">
          <div className="admin-appointments-board-heading">
            <div>
              <p className="admin-appointments-panel-label">Schedule Board</p>
              <h3>{viewMode === "list" ? "List workflow" : "Calendar workflow"}</h3>
            </div>

            <div className="admin-appointments-tabs" role="tablist" aria-label="Appointments view">
              <button
                type="button"
                className={`admin-appointments-tab ${viewMode === "list" ? "is-active" : ""}`.trim()}
                onClick={() => setViewMode("list")}
                role="tab"
                aria-selected={viewMode === "list"}
              >
                List View
              </button>
              <button
                type="button"
                className={`admin-appointments-tab ${viewMode === "calendar" ? "is-active" : ""}`.trim()}
                onClick={() => setViewMode("calendar")}
                role="tab"
                aria-selected={viewMode === "calendar"}
              >
                Calendar View
              </button>
            </div>
          </div>

          <div className={`admin-appointments-activity ${isPending ? "is-pending" : ""}`.trim()}>
            <span className="admin-appointments-activity-dot" aria-hidden="true" />
            <p>{isPending ? "Updating workspace..." : activityNote}</p>
          </div>
        </div>

        <div className="admin-appointments-toolbar-bottom">
          <label className="admin-appointments-search">
            <SearchIcon />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search customer, service, or ID"
            />
          </label>

          <div className="admin-appointments-toolbar-right">
            <label className="admin-appointments-filter is-field">
              <CalendarIcon />
              <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
            </label>

            <label className="admin-appointments-filter is-field">
              <ServiceIcon />
              <select value={selectedService} onChange={(event) => setSelectedService(event.target.value)}>
                <option value="all">All Services</option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-appointments-filter is-field">
              <StatusIcon />
              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value as FilterStatus)}
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="checked-in">Checked In</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="admin-appointments-empty">
          <strong>No appointments match these filters.</strong>
          <p>Change the date or add a new appointment to keep the board active.</p>
        </div>
      ) : viewMode === "list" ? (
        <div className="admin-appointment-schedule-list">
          {filteredAppointments.map((appointment) => (
            <article key={appointment.reference} className={`admin-appointment-list-card is-${appointment.status}`.trim()}>
              <div className="admin-appointment-time-block">
                <span>{appointment.time}</span>
                <strong>{formatDateLabel(appointment.date)}</strong>
                <p>{appointment.duration} service window</p>
              </div>

              <div className="admin-appointment-card-main">
                <div className="admin-appointment-customer">
                  <div className="admin-appointment-avatar" aria-hidden="true">
                    {getInitials(appointment.customer)}
                  </div>

                  <div className="admin-appointment-identity">
                    <div className="admin-appointment-name-row">
                      <strong>{appointment.customer}</strong>
                      {appointment.priority === "priority" ? (
                        <span className="admin-appointment-priority">Priority</span>
                      ) : null}
                    </div>
                    <p>ID: {appointment.reference}</p>
                    <span>{appointment.email}</span>
                  </div>
                </div>

                <div className="admin-appointment-service-block">
                  <div className="admin-appointment-detail">
                    <span className="admin-appointment-detail-title">
                      <ServiceIcon />
                      {appointment.service}
                    </span>
                    <p>{appointment.note}</p>
                  </div>

                  <div className="admin-appointment-inline-meta">
                    <span className="admin-appointment-inline-pill">
                      <CalendarIcon />
                      {formatDateLabel(appointment.date)}
                    </span>
                    <span className="admin-appointment-inline-pill">
                      <ClockIcon />
                      {appointment.duration}
                    </span>
                    <span className="admin-appointment-inline-pill">
                      <span>ID: {appointment.reference}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="admin-appointment-card-side">
                <div className="admin-appointment-state-wrap">
                  <span className={`admin-appointment-state is-${appointment.status}`.trim()}>
                    {formatStatusLabel(appointment.status)}
                  </span>
                </div>

                <div className="admin-appointment-card-actions">
                  <button
                    type="button"
                    className={`admin-appointment-action is-primary is-${appointment.status}`.trim()}
                    onClick={() => handlePrimaryAction(appointment)}
                  >
                    {appointment.status === "checked-in" ? "Complete" : "Check In"}
                  </button>
                  <button type="button" className="admin-appointment-action" onClick={() => openEdit(appointment)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-appointment-icon-button"
                    onClick={() =>
                      setMenuReference((currentReference) =>
                        currentReference === appointment.reference ? null : appointment.reference,
                      )
                    }
                  >
                    <MoreIcon />
                  </button>

                  {menuReference === appointment.reference ? (
                    <div className="admin-appointment-menu">
                      <button type="button" onClick={() => handleDuplicate(appointment)}>
                        Duplicate
                      </button>
                      <button type="button" onClick={() => openEdit(appointment)}>
                        Edit Details
                      </button>
                      <button type="button" className="is-danger" onClick={() => handleDelete(appointment)}>
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="admin-appointments-calendar-grid">
          {filteredAppointments.map((appointment) => (
            <article key={appointment.reference} className={`admin-calendar-card is-${appointment.status}`.trim()}>
              <div className="admin-calendar-time">
                <span>{appointment.time}</span>
                <small>{appointment.duration}</small>
              </div>
              <div className="admin-calendar-copy">
                <strong>{appointment.customer}</strong>
                <p>{appointment.service}</p>
                <span>{appointment.note}</span>
              </div>
              <div className="admin-calendar-actions">
                <span className={`admin-appointment-state is-${appointment.status}`.trim()}>
                  {formatStatusLabel(appointment.status)}
                </span>
                <button type="button" className="admin-appointment-action is-primary" onClick={() => handlePrimaryAction(appointment)}>
                  {appointment.status === "checked-in" ? "Complete" : "Check In"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <section className="admin-completed-panel">
        <div className="admin-completed-panel-head">
          <p className="admin-completed-kicker">Completed Today</p>
          <span>{filteredCompleted.length} finished appointments</span>
        </div>
        <div className="admin-completed-list">
          {filteredCompleted.length === 0 ? (
            <div className="admin-completed-empty">
              <strong>No completed appointments for this date.</strong>
              <p>Items move here when you mark them complete.</p>
            </div>
          ) : (
            filteredCompleted.map((appointment) => (
              <article key={appointment.reference} className="admin-completed-item">
                <span className="admin-completed-icon" aria-hidden="true">
                  <CheckIcon />
                </span>
                <div className="admin-completed-copy">
                  <strong>{appointment.customer}</strong>
                  <p>{appointment.time} - {appointment.service}</p>
                </div>
                <div className="admin-completed-actions">
                  <button
                    type="button"
                    className="admin-completed-link"
                    onClick={() =>
                      setActivityNote(
                        `${appointment.customer} completed ${appointment.service} at ${appointment.time}.`,
                      )
                    }
                  >
                    {appointment.summaryLabel}
                  </button>
                  <button
                    type="button"
                    className="admin-completed-delete"
                    onClick={() => handleCompletedDelete(appointment)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {isComposerOpen ? (
        <div className="admin-composer-backdrop" role="presentation" onClick={closeComposer}>
          <section
            className="admin-composer-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-composer-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-composer-head">
              <div>
                <p className="admin-composer-kicker">{editingReference ? "Edit Appointment" : "New Appointment"}</p>
                <h3 id="appointment-composer-title">
                  {editingReference ? "Update schedule details" : "Create an appointment"}
                </h3>
                <p className="admin-composer-description">
                  {editingReference
                    ? "Refine the customer details, schedule, and service information for this visit."
                    : "Add a new front-desk booking with the same structure used across the appointments workspace."}
                </p>
                <div className="admin-composer-meta">
                  <span className="admin-composer-chip">
                    {editingReference ? "Editing existing booking" : "New front-desk booking"}
                  </span>
                  <span className="admin-composer-chip is-accent">{formatDateLabel(draft.date)}</span>
                </div>
              </div>
              <button type="button" className="admin-composer-close" onClick={closeComposer}>
                <CloseIcon />
              </button>
            </div>

            <form className="admin-composer-form" onSubmit={handleSubmit}>
              <section className="admin-composer-section">
                <div className="admin-composer-section-head">
                  <strong>Customer Details</strong>
                  <p>Capture the client identity and requested service.</p>
                </div>

                <div className="admin-composer-grid">
                  <label className="admin-composer-field">
                    <span>Customer Name</span>
                    <input type="text" name="customer" value={draft.customer} onChange={handleDraftChange} required />
                  </label>
                  <label className="admin-composer-field">
                    <span>Email</span>
                    <input type="email" name="email" value={draft.email} onChange={handleDraftChange} required />
                  </label>
                  <label className="admin-composer-field admin-composer-field-full">
                    <span>Service</span>
                    <input type="text" name="service" value={draft.service} onChange={handleDraftChange} required />
                  </label>
                  <label className="admin-composer-field admin-composer-field-full">
                    <span>Session Note</span>
                    <textarea name="note" value={draft.note} onChange={handleDraftChange} rows={4} required />
                  </label>
                </div>
              </section>

              <section className="admin-composer-section">
                <div className="admin-composer-section-head">
                  <strong>Schedule Setup</strong>
                  <p>Keep the timing, status, and board priority aligned with the workspace.</p>
                </div>

                <div className="admin-composer-grid">
                  <label className="admin-composer-field">
                    <span>Date</span>
                    <input type="date" name="date" value={draft.date} onChange={handleDraftChange} required />
                  </label>
                  <label className="admin-composer-field">
                    <span>Time</span>
                    <input type="time" name="time" value={draft.time} onChange={handleDraftChange} required />
                  </label>
                  <label className="admin-composer-field">
                    <span>Duration (mins)</span>
                    <input
                      type="number"
                      min="15"
                      step="15"
                      name="duration"
                      value={draft.duration}
                      onChange={handleDraftChange}
                      required
                    />
                  </label>
                  <label className="admin-composer-field">
                    <span>Status</span>
                    <select name="status" value={draft.status} onChange={handleDraftChange}>
                      <option value="scheduled">Scheduled</option>
                      <option value="checked-in">Checked In</option>
                    </select>
                  </label>
                  <label className="admin-composer-field admin-composer-field-checkbox admin-composer-field-full">
                    <span>Priority Slot</span>
                    <span className="admin-composer-checkbox-row">
                      <input type="checkbox" name="priority" checked={draft.priority} onChange={handleDraftChange} />
                      <span>Flag this appointment for priority handling on the live board.</span>
                    </span>
                  </label>
                </div>
              </section>

              <div className="admin-composer-actions">
                <button type="button" className="admin-composer-secondary" onClick={closeComposer}>
                  Cancel
                </button>
                <button type="submit" className="admin-appointments-create">
                  <PlusIcon />
                  <span>{editingReference ? "Save Changes" : "Add Appointment"}</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </section>
  );
}
