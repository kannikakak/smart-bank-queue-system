"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminAppointmentsWorkspace } from "@/admin/components/AdminAppointmentsWorkspace";
import {
  type AdminStat,
  type AppointmentEntry,
  type DemandBar,
  type QueueEntry,
  type ServicePerformanceEntry,
  type StaffEfficiencyEntry,
} from "@/admin/lib/workspace-data";
import {
  getAdminAppointments,
  getAdminOverview,
  type AdminAppointmentSummary,
  type AdminOverview,
} from "@/shared/lib/api";

type DashboardSectionsProps = {
  focus?: "dashboard" | "appointments" | "queue" | "transactions" | "settings" | "help";
};

type PeriodFilter = "7d" | "30d" | "90d";
type ServiceFilter = "all" | "accounts" | "loans" | "cards" | "transfers";
type DemandView = "today" | "weekday" | "peak";

const periodOptions: { value: PeriodFilter; label: string }[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
];

const serviceOptions: { value: ServiceFilter; label: string }[] = [
  { value: "all", label: "All Services" },
  { value: "accounts", label: "Account Services" },
  { value: "loans", label: "Loan Services" },
  { value: "cards", label: "Card Services" },
  { value: "transfers", label: "Transfer Services" },
];

const demandViewOptions: { value: DemandView; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "weekday", label: "Weekday Average" },
  { value: "peak", label: "Peak Focus" },
];

type SecondaryWorkspaceFocus = "queue" | "transactions" | "settings" | "help";
type SettingsChecklistItem = {
  title: string;
  detail: string;
  note: string;
  status: "waiting" | "in-progress" | "completed";
};

const secondaryWorkspaceContent: Record<
  SecondaryWorkspaceFocus,
  {
    pageTitle: string;
    pageLinkHref: string;
    pageLinkLabel: string;
    pageDescription: string;
    sideTitle: string;
    servingTitle: string;
    servingLines: string[];
    queueTitle: string;
    highlightKicker: string;
    metaTags: string[];
    actionNote: string;
    primaryAction: string;
    secondaryAction: string;
  }
> = {
  queue: {
    pageTitle: "Consultation Board",
    pageLinkHref: "/portal/bookings?role=admin",
    pageLinkLabel: "Open board",
    pageDescription: "Live queue and handoff status.",
    sideTitle: "Upcoming Consultations",
    servingTitle: "Q-042: Michael Chen",
    servingLines: ["Service: Business Loan Consultation", "Consultation Started: 10:42 AM"],
    queueTitle: "Live Consultations",
    highlightKicker: "In Consultation",
    metaTags: ["Advisor room", "Arrival ready", "Priority consult"],
    actionNote: "Close the active consultation before calling the next customer.",
    primaryAction: "Complete Consultation",
    secondaryAction: "Flag Follow-Up",
  },
  transactions: {
    pageTitle: "Transactions Oversight",
    pageLinkHref: "/portal?role=admin&section=transactions",
    pageLinkLabel: "Open reviews",
    pageDescription: "Pending approvals and exceptions.",
    sideTitle: "Recent Approvals",
    servingTitle: "Transaction review board",
    servingLines: ["Service: International transfer approvals", "Window: Counter 04"],
    queueTitle: "Transaction Review",
    highlightKicker: "Transaction Watch",
    metaTags: ["Counter 04", "Review lane", "Approval required"],
    actionNote: "Clear active reviews before opening the next item.",
    primaryAction: "Approve Item",
    secondaryAction: "Hold Review",
  },
  settings: {
    pageTitle: "Experience Settings",
    pageLinkHref: "/portal?role=admin&section=settings",
    pageLinkLabel: "Open checklist",
    pageDescription: "Devices, roles, and alerts.",
    sideTitle: "Readiness Checklist",
    servingTitle: "Experience setup review",
    servingLines: ["Service: Notifications, routing, and branch setup", "Review updated: 10:42 AM"],
    queueTitle: "Configuration Tasks",
    highlightKicker: "Settings Review",
    metaTags: ["Hardware check", "Alert sync", "Branch setup"],
    actionNote: "Review devices and alerts before saving.",
    primaryAction: "Save Changes",
    secondaryAction: "Reset Draft",
  },
  help: {
    pageTitle: "Support Center",
    pageLinkHref: "/portal?role=admin&section=help",
    pageLinkLabel: "Open support",
    pageDescription: "Escalations and response queue.",
    sideTitle: "Help Requests",
    servingTitle: "Priority support ticket",
    servingLines: ["Service: Branch support escalation", "Response target: within 12 minutes"],
    queueTitle: "Support Requests",
    highlightKicker: "Support Watch",
    metaTags: ["Escalation lane", "Response SLA", "Branch issue"],
    actionNote: "Resolve or escalate before moving to the next ticket.",
    primaryAction: "Resolve Ticket",
    secondaryAction: "Escalate Issue",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function parseMinutes(value: string) {
  return Number(value.replace(/[^0-9]/g, "")) || 0;
}

function formatMinutesAndSeconds(minutesValue: number, secondsValue: number) {
  return `${minutesValue}m ${secondsValue.toString().padStart(2, "0")}s`;
}

function formatStatusLabel(status: "waiting" | "in-progress" | "completed") {
  if (status === "in-progress") {
    return "In Progress";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function matchesService(service: string, filter: ServiceFilter) {
  if (filter === "all") return true;
  if (filter === "accounts") return /account/i.test(service);
  if (filter === "loans") return /loan|mortgage/i.test(service);
  if (filter === "cards") return /card/i.test(service);
  return /transfer/i.test(service);
}

function getServiceOffset(filter: ServiceFilter, index: number) {
  const offsets: Record<ServiceFilter, number[]> = {
    all: [0, 0, 0, 0, 0, 0, 0, 0],
    accounts: [-2, 1, 6, 8, 5, 0, -2, -3],
    loans: [-4, -3, 2, 6, 9, 4, -1, -5],
    cards: [2, 4, 5, 2, 0, -1, 1, 1],
    transfers: [-1, 0, 2, 4, 7, 3, 0, -2],
  };

  return offsets[filter][index] ?? 0;
}

function getDemandViewOffset(view: DemandView, index: number) {
  if (view === "weekday") {
    return [0, 1, 4, 6, 5, 2, 1, 0][index] ?? 0;
  }

  if (view === "peak") {
    return [-2, 0, 8, 10, 8, 2, -1, -3][index] ?? 0;
  }

  return 0;
}

function buildDemandBars(
  baseBars: DemandBar[],
  period: PeriodFilter,
  service: ServiceFilter,
  view: DemandView,
) {
  const periodOffset: Record<PeriodFilter, number> = {
    "7d": -5,
    "30d": 0,
    "90d": 6,
  };

  const sourceBars =
    baseBars.length > 0
      ? baseBars
      : [
          { hour: "09:00", value: 34 },
          { hour: "10:00", value: 43 },
          { hour: "11:00", value: 76, highlight: true },
          { hour: "12:00", value: 88, highlight: true },
          { hour: "13:00", value: 82, highlight: true },
          { hour: "14:00", value: 52 },
          { hour: "15:00", value: 47 },
          { hour: "16:00", value: 29 },
        ];

  const nextBars = sourceBars.map((bar, index) => ({
    ...bar,
    value: clamp(bar.value + periodOffset[period] + getServiceOffset(service, index) + getDemandViewOffset(view, index), 18, 92),
  }));

  const topValues = [...nextBars].sort((left, right) => right.value - left.value).slice(0, 3).map((bar) => bar.hour);

  return nextBars.map((bar) => ({
    ...bar,
    highlight: topValues.includes(bar.hour),
  }));
}

function getPeakHoursLabel(bars: { hour: string; value: number }[]) {
  const peakIndex = bars.reduce((bestIndex, currentBar, currentIndex, list) => {
    return currentBar.value > list[bestIndex].value ? currentIndex : bestIndex;
  }, 0);
  const startIndex = Math.max(0, peakIndex - 1);
  const endIndex = Math.min(bars.length - 1, startIndex + 2);
  return `${bars[startIndex]?.hour ?? "09:00"} - ${bars[endIndex]?.hour ?? "11:00"}`;
}

function mapTrendTone(tone: "lime" | "orange" | "green" | "slate") {
  if (tone === "orange") return "alert";
  if (tone === "slate") return "neutral";
  return "positive";
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm4.3 6.8-5.13 5.56-2.47-2.48-1.42 1.41 3.94 3.95 6.55-7.11-1.47-1.33Z"
        fill="currentColor"
      />
    </svg>
  );
}

function NoShowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 5.76 6.41 4.35 19.65 17.6l-1.41 1.4-2.25-2.24A8.92 8.92 0 0 1 12 17.7c-2.99 0-5.7-1.48-7.35-3.87a1.32 1.32 0 0 1 0-1.49 10.39 10.39 0 0 1 4.08-3.57L5 5.76Zm7 1.64a4.6 4.6 0 0 1 4.6 4.6c0 .64-.13 1.24-.36 1.79l-1.58-1.58c.02-.07.04-.14.04-.21A2.7 2.7 0 0 0 12 9.3c-.07 0-.14.02-.21.04L10.2 7.76c.55-.23 1.15-.36 1.8-.36Zm0-3.1c2.99 0 5.7 1.48 7.35 3.87.31.45.31 1.04 0 1.49a10.52 10.52 0 0 1-2.96 2.95l-1.42-1.42a8.51 8.51 0 0 0 2.3-1.78A8.57 8.57 0 0 0 12 6.2c-.79 0-1.56.11-2.28.32L8.12 4.93A10.6 10.6 0 0 1 12 4.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function QueueIllustrationIcon() {
  return (
    <svg viewBox="0 0 160 160" aria-hidden="true">
      <circle cx="95" cy="40" r="20" fill="currentColor" opacity="0.8" />
      <path
        d="M63 91c0-14.36 11.64-26 26-26h12c14.36 0 26 11.64 26 26v18H63V91Z"
        fill="currentColor"
        opacity="0.42"
      />
      <circle cx="120" cy="98" r="25" fill="none" stroke="currentColor" strokeWidth="10" opacity="0.5" />
      <path d="m138 118 14 14" stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 2h2v2h6V2h2v2h1.5A2.5 2.5 0 0 1 21 6.5v12A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5v-12A2.5 2.5 0 0 1 5.5 4H7V2Zm12 8h-14v8.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V10Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16v2l-6 6v5l-4 2v-7L4 7V5Z" fill="currentColor" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M11 4h2v7.17l2.59-2.58L17 10l-5 5-5-5 1.41-1.41L11 11.17V4Zm-6 12h14v4H5v-4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7.41 8.59 4.59 4.58 4.59-4.58L18 10l-6 6-6-6 1.41-1.41Z" fill="currentColor" />
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

function WaitMetricIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 4h-2v5.25l3.75 2.25 1-1.64-2.75-1.66V7Zm6 5h-2a5 5 0 1 0-1.46 3.54l1.42 1.42A7 7 0 1 1 19 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

function VolumeMetricIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M16 11a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-8 0a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm4-8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c2.86 0 8 1.43 8 4.29V19H4v-1.71C4 14.43 9.14 13 12 13Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ServiceMetricIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3a5.5 5.5 0 0 1 5.5 5.5c0 1.46-.58 2.86-1.61 3.89L14 14.28V19h-4v-4.72l-1.89-1.89A5.5 5.5 0 1 1 12 3Zm1 5h-2v4h2V8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PeakMetricIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 4h-2v6l4 2 .9-1.8-2.9-1.45V7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MetricIcon({ icon }: { icon: "wait" | "volume" | "service" | "peak" }) {
  if (icon === "volume") {
    return <VolumeMetricIcon />;
  }

  if (icon === "service") {
    return <ServiceMetricIcon />;
  }

  if (icon === "peak") {
    return <PeakMetricIcon />;
  }

  return <WaitMetricIcon />;
}

function RatingStars({ value }: { value: number }) {
  return (
    <div className="admin-service-rating" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < value ? "is-filled" : ""}>
          {"\u2605"}
        </span>
      ))}
    </div>
  );
}

function parseHighlightDetail(line: string) {
  const separatorIndex = line.indexOf(":");

  if (separatorIndex === -1) {
    return { label: "Detail", value: line };
  }

  return {
    label: line.slice(0, separatorIndex),
    value: line.slice(separatorIndex + 1).trim(),
  };
}

function formatHourLabel(dateTime: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(dateTime));
}

function formatTimeLabel(dateTime: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateTime));
}

function formatDateLabel(dateTime: string) {
  return new Intl.DateTimeFormat("en-CA").format(new Date(dateTime));
}

function mapAdminAppointmentsToQueueEntries(
  appointments: AdminAppointmentSummary[],
): QueueEntry[] {
  return appointments.slice(0, 4).map((appointment) => ({
    ticket: `A-${appointment.id}`,
    customer: appointment.customerName,
    service: appointment.service,
    status:
      appointment.status === "COMPLETED"
        ? "completed"
        : appointment.status === "WAITING"
          ? "waiting"
          : "in-progress",
    action:
      appointment.status === "COMPLETED"
        ? "Done"
        : appointment.status === "WAITING"
          ? "Prepare"
          : "In Session",
  }));
}

function mapAdminAppointmentsToTodayAppointments(
  appointments: AdminAppointmentSummary[],
): AppointmentEntry[] {
  return appointments.slice(0, 3).map((appointment) => ({
    time: formatTimeLabel(appointment.scheduledAt),
    customer: appointment.customerName,
    service: appointment.service,
    status:
      appointment.status === "COMPLETED"
        ? "checked-in"
        : appointment.status === "WAITING"
          ? "upcoming"
          : "delayed",
  }));
}

function buildServicePerformanceEntries(
  appointments: AdminAppointmentSummary[],
): ServicePerformanceEntry[] {
  const grouped = new Map<
    string,
    { tickets: number; assignedStaff: string[] }
  >();

  appointments.forEach((appointment) => {
    const current = grouped.get(appointment.service) ?? {
      tickets: 0,
      assignedStaff: [],
    };

    current.tickets += 1;

    if (
      appointment.assignedStaff &&
      !current.assignedStaff.includes(appointment.assignedStaff)
    ) {
      current.assignedStaff.push(appointment.assignedStaff);
    }

    grouped.set(appointment.service, current);
  });

  return Array.from(grouped.entries()).map(([service, value]) => ({
    service,
    tickets: value.tickets,
    avgWait: `${Math.max(5, 8 + value.tickets)}m`,
    avgDuration: `${Math.max(10, 12 + value.assignedStaff.length * 5)}m`,
    satisfaction: value.tickets >= 2 ? 5 : 4,
    staffAssigned:
      value.assignedStaff.length > 0 ? value.assignedStaff : ["Unassigned"],
  }));
}

function buildStaffEfficiencyEntries(
  appointments: AdminAppointmentSummary[],
): StaffEfficiencyEntry[] {
  const grouped = new Map<string, number>();

  appointments.forEach((appointment) => {
    const key = appointment.assignedStaff ?? "Unassigned";
    grouped.set(key, (grouped.get(key) ?? 0) + 1);
  });

  return Array.from(grouped.entries()).map(([name, count]) => ({
    name,
    role: name === "Unassigned" ? "Pending" : "Staff",
    score: clamp(70 + count * 6, 72, 98),
  }));
}

function buildDemandBarsFromAppointments(
  appointments: AdminAppointmentSummary[],
): DemandBar[] {
  const byHour = new Map<string, number>();

  appointments.forEach((appointment) => {
    const hour = formatHourLabel(appointment.scheduledAt);
    byHour.set(hour, (byHour.get(hour) ?? 0) + 1);
  });

  const hours = Array.from({ length: 8 }, (_, index) =>
    `${(9 + index).toString().padStart(2, "0")}:00`,
  );
  const maxCount = Math.max(...Array.from(byHour.values()), 1);

  return hours.map((hour) => ({
    hour,
    value: clamp(Math.round(((byHour.get(hour) ?? 0) / maxCount) * 88), 18, 92),
  }));
}

export function AdminDashboardSections({ focus = "dashboard" }: DashboardSectionsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>("30d");
  const [selectedService, setSelectedService] = useState<ServiceFilter>("all");
  const [selectedDemandView, setSelectedDemandView] = useState<DemandView>("today");
  const [tableFilter, setTableFilter] = useState<"all" | "top-rated">("all");
  const [showStaffColumn, setShowStaffColumn] = useState(true);
  const [showTopPerformersOnly, setShowTopPerformersOnly] = useState(false);
  const [actionMessage, setActionMessage] = useState("Dashboard filters are live.");
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [appointments, setAppointments] = useState<AdminAppointmentSummary[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isDashboard = focus === "dashboard";
  const isAppointments = focus === "appointments";
  const isTransactions = focus === "transactions";
  const isSettings = focus === "settings";
  const isHelp = focus === "help";
  const secondaryFocus: SecondaryWorkspaceFocus = isTransactions
    ? "transactions"
    : isSettings
      ? "settings"
      : isHelp
        ? "help"
        : "queue";
  const secondaryContent = secondaryWorkspaceContent[secondaryFocus];

  useEffect(() => {
    let isMounted = true;

    async function loadAdminData() {
      try {
        const [overviewResponse, appointmentsResponse] = await Promise.all([
          getAdminOverview(),
          getAdminAppointments(),
        ]);

        if (!isMounted) {
          return;
        }

        setOverview(overviewResponse);
        setAppointments(appointmentsResponse);
        setLoadError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setLoadError(
          error instanceof Error && error.message
            ? error.message
            : "Unable to load admin dashboard data.",
        );
      }
    }

    void loadAdminData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAppointments) {
    return <AdminAppointmentsWorkspace />;
  }

  const servicePerformanceEntries = buildServicePerformanceEntries(appointments);
  const staffEfficiencyEntries = buildStaffEfficiencyEntries(appointments);
  const adminStats: AdminStat[] = [
    {
      label: "Daily Appointments",
      value: overview?.metrics.totalAppointments ?? "0",
      trend: `${overview?.metrics.waitingAppointments ?? "0"} Pending`,
      trendTone: "lime",
    },
    {
      label: "Awaiting Arrival",
      value: overview?.metrics.waitingAppointments ?? "0",
      trend: `${overview?.peakHours[0] ?? "No peak hour"}`,
      trendTone: "orange",
    },
    {
      label: "Completed Today",
      value: overview?.metrics.completedAppointments ?? "0",
      trend: `${overview?.topServices[0] ?? "No completed services yet"}`,
      trendTone: "green",
    },
  ];
  const activeBranchesCount = Number(overview?.metrics.activeBranches ?? "0");
  const activeStaffCount = Number(overview?.metrics.activeStaff ?? "0");
  const activeServicesCount = Number(overview?.metrics.activeServices ?? "0");
  const waitingAppointmentsCount = Number(overview?.metrics.waitingAppointments ?? "0");
  const completedAppointmentsCount = Number(overview?.metrics.completedAppointments ?? "0");
  const settingsStats: AdminStat[] = [
    {
      label: "Branches Synced",
      value: String(activeBranchesCount),
      trend: activeBranchesCount > 0 ? "Network healthy" : "Sync required",
      trendTone: activeBranchesCount > 0 ? "green" : "orange",
    },
    {
      label: "Staff Access",
      value: String(activeStaffCount),
      trend: activeStaffCount > 0 ? "Profiles active" : "No staff loaded",
      trendTone: activeStaffCount > 0 ? "lime" : "orange",
    },
    {
      label: "Alert Rules",
      value: String(activeServicesCount),
      trend: activeServicesCount > 0 ? "Coverage live" : "No alert coverage",
      trendTone: activeServicesCount > 0 ? "slate" : "orange",
    },
  ];
  const settingsTasks: QueueEntry[] = [
    {
      ticket: "CFG-101",
      customer: "Branch hardware",
      service: `${activeBranchesCount} branches reporting device status`,
      status: activeBranchesCount > 0 ? "completed" : "waiting",
      action: activeBranchesCount > 0 ? "Reviewed" : "Check now",
    },
    {
      ticket: "CFG-102",
      customer: "Access control",
      service: `${activeStaffCount} staff profiles ready for admin review`,
      status: activeStaffCount > 0 ? "in-progress" : "waiting",
      action: "Verify roles",
    },
    {
      ticket: "CFG-103",
      customer: "Alert routing",
      service: `${activeServicesCount} service rules currently monitored`,
      status: activeServicesCount > 0 ? "in-progress" : "waiting",
      action: "Open alerts",
    },
    {
      ticket: "CFG-104",
      customer: "Appointment readiness",
      service: `${waitingAppointmentsCount} upcoming appointments visible to branch staff`,
      status: waitingAppointmentsCount > 0 ? "waiting" : "completed",
      action: waitingAppointmentsCount > 0 ? "Review load" : "Healthy",
    },
  ];
  const settingsChecklist: SettingsChecklistItem[] = [
    {
      title: "Device sync status",
      detail: `${activeBranchesCount} branch workstations are reporting online.`,
      note: "Confirm branch devices before opening the next service window.",
      status: activeBranchesCount > 0 ? "completed" : "waiting",
    },
    {
      title: "Role and access review",
      detail: `${activeStaffCount} staff profiles are available for access validation.`,
      note: "Make sure branch admins and service staff still have the correct roles.",
      status: activeStaffCount > 0 ? "in-progress" : "waiting",
    },
    {
      title: "Notification coverage",
      detail: `${activeServicesCount} service alerts are mapped to the current branch setup.`,
      note: "Check message routing before saving the final station configuration.",
      status: activeServicesCount > 0 ? "completed" : "waiting",
    },
  ];
  const liveQueueEntries = mapAdminAppointmentsToQueueEntries(appointments);
  const todayAppointments = mapAdminAppointmentsToTodayAppointments(appointments);
  const baseDemandBars = buildDemandBarsFromAppointments(appointments);
  const visibleServicesBase = servicePerformanceEntries.filter((entry) => matchesService(entry.service, selectedService));
  const visibleServices =
    tableFilter === "top-rated"
      ? visibleServicesBase.filter((entry) => entry.satisfaction >= 5)
      : visibleServicesBase;
  const demandBars = buildDemandBars(baseDemandBars, selectedPeriod, selectedService, selectedDemandView);
  const visibleStaffNames = Array.from(new Set(visibleServicesBase.flatMap((entry) => entry.staffAssigned)));
  const staffPool = staffEfficiencyEntries.filter((entry) => visibleStaffNames.includes(entry.name));
  const staffEntries = (staffPool.length > 0 ? staffPool : staffEfficiencyEntries).slice(
    0,
    showTopPerformersOnly ? 3 : undefined,
  );

  const totalTickets = visibleServicesBase.reduce((total, entry) => total + entry.tickets, 0);
  const averageWait = visibleServicesBase.length
    ? visibleServicesBase.reduce((total, entry) => total + parseMinutes(entry.avgWait), 0) / visibleServicesBase.length
    : 12;
  const averageDuration = visibleServicesBase.length
    ? visibleServicesBase.reduce((total, entry) => total + parseMinutes(entry.avgDuration), 0) /
      visibleServicesBase.length /
      3
    : 8;

  const periodVolumeMultiplier: Record<PeriodFilter, number> = {
    "7d": 8.4,
    "30d": 10.4,
    "90d": 12.2,
  };

  const periodDeltaLabels: Record<PeriodFilter, string> = {
    "7d": "-6% vs prior week",
    "30d": "+8% vs last week",
    "90d": "+11% vs last month",
  };

  const peakHoursLabel = getPeakHoursLabel(demandBars);
  const waitMinutes = clamp(Math.round(averageWait + (selectedPeriod === "90d" ? 1 : selectedPeriod === "7d" ? -1 : 0)), 8, 22);
  const waitSeconds = selectedService === "loans" ? 50 : selectedService === "accounts" ? 25 : 20;
  const serviceMinutes = clamp(Math.round(averageDuration), 5, 16);
  const serviceSeconds = selectedService === "transfers" ? 15 : selectedService === "cards" ? 30 : 45;
  const customerVolume = Math.round(totalTickets * periodVolumeMultiplier[selectedPeriod]);
  const dashboardMetrics = [
    {
      label: "Avg. Wait Time",
      value: formatMinutesAndSeconds(waitMinutes, waitSeconds),
      delta: selectedPeriod === "7d" ? "-9% vs last week" : selectedPeriod === "90d" ? "+4% vs last month" : "-12% vs last week",
      deltaTone: selectedPeriod === "90d" ? ("neutral" as const) : ("positive" as const),
      icon: "wait" as const,
    },
    {
      label: "Daily Customer Volume",
      value: customerVolume.toLocaleString(),
      delta: periodDeltaLabels[selectedPeriod],
      deltaTone: "positive" as const,
      icon: "volume" as const,
    },
    {
      label: "Avg. Service Time",
      value: formatMinutesAndSeconds(serviceMinutes, serviceSeconds),
      delta: showTopPerformersOnly ? "Top staff view" : "Stable",
      deltaTone: "neutral" as const,
      icon: "service" as const,
    },
    {
      label: "Peak Hours Today",
      value: peakHoursLabel,
      delta: selectedDemandView === "peak" ? "Peak focus" : "Alert",
      deltaTone: "alert" as const,
      icon: "peak" as const,
    },
  ];
  const queueItems = liveQueueEntries.slice(0, 4);
  const arrivalItems = todayAppointments.slice(0, 4);
  const serviceRows = visibleServices.slice(0, 5);
  const queueAlertCount = queueItems.filter((item) => item.status === "waiting").length;
  const nextArrival = arrivalItems[0];
  const compactSummaryItems = [
    { label: "Branches", value: String(activeBranchesCount) },
    { label: "Waiting", value: String(waitingAppointmentsCount) },
    { label: "Completed", value: String(completedAppointmentsCount) },
  ];

  function handleExport() {
    const headings = [
      "service",
      "tickets",
      "avg_wait",
      "avg_duration",
      "satisfaction",
      ...(showStaffColumn ? ["staff_assigned"] : []),
    ];
    const rows = visibleServices.map((entry) => [
      entry.service,
      String(entry.tickets),
      entry.avgWait,
      entry.avgDuration,
      `${entry.satisfaction}/5`,
      ...(showStaffColumn ? [entry.staffAssigned.join(" | ")] : []),
    ]);
    const csv = [headings.join(","), ...rows.map((row) => row.map((item) => `"${item}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `smartq-report-${selectedPeriod}-${selectedService}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setActionMessage(`Exported ${visibleServices.length} rows for ${serviceOptions.find((option) => option.value === selectedService)?.label}.`);
  }

  if (isDashboard) {
    return (
      <section className="admin-system-page">
        {loadError ? (
          <p className="auth-error-message" aria-live="polite">
            {loadError}
          </p>
        ) : null}

        <header className="admin-system-hero">
          <div className="admin-system-hero-copy">
            <p className="admin-system-kicker">Operations</p>
            <h2>Dashboard</h2>
            <div className="admin-system-inline-stats" aria-label="Dashboard summary">
              {compactSummaryItems.map((item) => (
                <span key={item.label}>
                  <strong>{item.value}</strong>
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="admin-system-controls">
            <div className="admin-analytics-hero-actions">
              <label className="admin-analytics-filter">
                <CalendarIcon />
                <select
                  className="admin-analytics-filter-select"
                  value={selectedPeriod}
                  onChange={(event) => {
                    const value = event.target.value as PeriodFilter;
                    setSelectedPeriod(value);
                    setActionMessage(
                      `Period: ${periodOptions.find((option) => option.value === value)?.label}.`,
                    );
                  }}
                >
                  {periodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon />
              </label>

              <label className="admin-analytics-filter">
                <FilterIcon />
                <select
                  className="admin-analytics-filter-select"
                  value={selectedService}
                  onChange={(event) => {
                    const value = event.target.value as ServiceFilter;
                    setSelectedService(value);
                    setActionMessage(
                      `Service: ${serviceOptions.find((option) => option.value === value)?.label}.`,
                    );
                  }}
                >
                  {serviceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon />
              </label>

              <button type="button" className="admin-analytics-export" onClick={handleExport}>
                <DownloadIcon />
                <span>Export</span>
              </button>
            </div>
          </div>
        </header>

        <section className="admin-system-metrics-grid" aria-label="Performance summary">
          {dashboardMetrics.map((metric) => (
            <article key={metric.label} className="admin-system-metric-card">
              <div className="admin-system-metric-top">
                <span className="admin-system-metric-icon" aria-hidden="true">
                  <MetricIcon icon={metric.icon} />
                </span>
                <span className={`admin-analytics-pill is-${metric.deltaTone}`.trim()}>
                  {metric.delta}
                </span>
              </div>
              <span className="admin-system-metric-label">{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </section>

        <section className="admin-system-grid">
          <article className="admin-system-panel admin-system-panel-wide">
            <div className="admin-system-panel-head">
              <h3>Demand</h3>
              <label className="admin-panel-select">
                <select
                  className="admin-panel-select-input"
                  value={selectedDemandView}
                  onChange={(event) => {
                    const value = event.target.value as DemandView;
                    setSelectedDemandView(value);
                    setActionMessage(
                      `View: ${demandViewOptions.find((option) => option.value === value)?.label}.`,
                    );
                  }}
                >
                  {demandViewOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon />
              </label>
            </div>

            <div className="admin-demand-chart" role="img" aria-label="Hourly service demand chart">
              {demandBars.map((bar) => (
                <div key={bar.hour} className="admin-demand-bar-group">
                  <div className="admin-demand-bar-track">
                    <span
                      className={`admin-demand-bar ${bar.highlight ? "is-highlight" : ""}`.trim()}
                      style={{ height: `${bar.value}%` }}
                    />
                  </div>
                  <span className="admin-demand-label">{bar.hour}</span>
                </div>
              ))}
            </div>

            <div className="admin-system-chart-summary">
              <div className="admin-system-summary-chip">
                <span>Peak</span>
                <strong>{peakHoursLabel}</strong>
              </div>
              <div className="admin-system-summary-chip">
                <span>Top service</span>
                <strong>{overview?.topServices[0] ?? "No data"}</strong>
              </div>
              <div className="admin-system-summary-chip">
                <span>Volume</span>
                <strong>{customerVolume.toLocaleString()}</strong>
              </div>
            </div>
          </article>

          <aside className="admin-system-stack">
            <article className="admin-system-panel">
              <div className="admin-system-panel-head">
                <h3>Live board</h3>
                <span
                  className={`admin-analytics-pill is-${queueAlertCount > 0 ? "alert" : "positive"}`.trim()}
                >
                  {queueAlertCount > 0 ? `${queueAlertCount} waiting` : "Stable"}
                </span>
              </div>

              <div className="admin-system-queue-list">
                {queueItems.map((entry) => (
                  <div key={entry.ticket} className="admin-system-queue-item">
                    <div>
                      <strong>{entry.customer}</strong>
                      <span>{entry.service}</span>
                    </div>
                    <span className={`admin-status-badge is-${entry.status}`.trim()}>
                      {formatStatusLabel(entry.status)}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-system-panel">
              <div className="admin-system-panel-head">
                <h3>Next arrival</h3>
                <Link href="/portal/bookings?role=admin" className="admin-inline-link">
                  Open
                </Link>
              </div>

              {nextArrival ? (
                <div className="admin-system-next-card">
                  <span className="admin-system-next-time">{nextArrival.time}</span>
                  <strong>{nextArrival.customer}</strong>
                  <p>{nextArrival.service}</p>
                  <span
                    className={`admin-status-badge is-${nextArrival.status === "checked-in" ? "completed" : nextArrival.status === "delayed" ? "waiting" : "in-progress"}`.trim()}
                  >
                    {nextArrival.status === "checked-in"
                      ? "Checked In"
                      : nextArrival.status === "delayed"
                        ? "Delayed"
                        : "Upcoming"}
                  </span>
                </div>
              ) : (
                <div className="admin-system-empty">No upcoming arrival.</div>
              )}
            </article>
          </aside>
        </section>

        <section className="admin-system-grid admin-system-grid-lower">
          <article className="admin-system-panel admin-system-panel-wide">
            <div className="admin-system-panel-head">
              <h3>Service mix</h3>
              <div className="admin-analytics-table-actions">
                <button
                  type="button"
                  className={`admin-table-action ${tableFilter === "top-rated" ? "is-active" : ""}`.trim()}
                  onClick={() => {
                    const nextFilter = tableFilter === "all" ? "top-rated" : "all";
                    setTableFilter(nextFilter);
                    setActionMessage(
                      nextFilter === "top-rated" ? "Top-rated services only." : "All services visible.",
                    );
                  }}
                >
                  {tableFilter === "all" ? "Top rated" : "Show all"}
                </button>
                <button
                  type="button"
                  className={`admin-table-action ${showStaffColumn ? "is-active" : ""}`.trim()}
                  onClick={() => {
                    setShowStaffColumn((current) => !current);
                    setActionMessage(showStaffColumn ? "Staff hidden." : "Staff visible.");
                  }}
                >
                  {showStaffColumn ? "Hide staff" : "Show staff"}
                </button>
              </div>
            </div>

            {serviceRows.length === 0 ? (
              <div className="admin-system-empty">No services match the current filter.</div>
            ) : (
              <div className="admin-system-service-list">
                {serviceRows.map((entry) => (
                  <div key={entry.service} className="admin-system-service-row">
                    <div className="admin-system-service-main">
                      <strong>{entry.service}</strong>
                      <span>
                        {Math.round(
                          entry.tickets * (selectedPeriod === "7d" ? 0.82 : selectedPeriod === "90d" ? 1.2 : 1),
                        )}{" "}
                        tickets
                      </span>
                    </div>
                    <span>{entry.avgWait}</span>
                    <span>{entry.avgDuration}</span>
                    <RatingStars value={entry.satisfaction} />
                    {showStaffColumn ? (
                      <div className="admin-service-staff">
                        {entry.staffAssigned.slice(0, 3).map((name) => (
                          <span key={name} className="admin-service-avatar" title={name}>
                            {getInitials(name)}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="admin-system-panel">
            <div className="admin-system-panel-head">
              <h3>Team</h3>
              <button
                type="button"
                className={`admin-panel-icon-button ${showTopPerformersOnly ? "is-active" : ""}`.trim()}
                aria-label="Toggle top performers"
                onClick={() => {
                  setShowTopPerformersOnly((current) => !current);
                  setActionMessage(showTopPerformersOnly ? "Full team visible." : "Top performers only.");
                }}
              >
                <MoreIcon />
              </button>
            </div>

            <div className="admin-system-team-list">
              {staffEntries.map((member) => (
                <div key={member.name} className="admin-system-team-item">
                  <div className="admin-efficiency-row">
                    <span>{member.name}</span>
                    <strong>{member.score}%</strong>
                  </div>
                  <div className="admin-efficiency-track" aria-hidden="true">
                    <span style={{ width: `${member.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <p className="admin-analytics-feedback" aria-live="polite">
          {actionMessage}
        </p>
      </section>
    );
  }

  if (isSettings) {
    return (
      <section className="admin-analytics-page admin-secondary-page">
        {loadError ? (
          <p className="auth-error-message" aria-live="polite">
            {loadError}
          </p>
        ) : null}

        <header className="admin-analytics-hero">
          <div className="admin-analytics-hero-copy">
            <p className="admin-secondary-page-kicker">Settings</p>
            <h2>Experience Settings</h2>
            <p>Devices, roles, and alerts.</p>
          </div>

          <div className="admin-analytics-hero-actions">
            <Link href={secondaryContent.pageLinkHref} className="admin-table-action">
              {secondaryContent.pageLinkLabel}
            </Link>
          </div>
        </header>

        <section
          className="admin-analytics-stats-grid admin-analytics-stats-grid-secondary"
          aria-label="Experience settings summary"
        >
          {settingsStats.map((stat, index) => (
            <article key={stat.label} className="admin-analytics-stat-card">
              <div className="admin-analytics-stat-top">
                <span className="admin-analytics-stat-icon" aria-hidden="true">
                  <MetricIcon icon={index === 0 ? "service" : index === 1 ? "volume" : "peak"} />
                </span>
                <span className={`admin-analytics-pill is-${mapTrendTone(stat.trendTone)}`.trim()}>{stat.trend}</span>
              </div>

              <div className="admin-analytics-stat-copy">
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
              </div>
            </article>
          ))}
        </section>

        <section className="admin-analytics-panel admin-operations-highlight">
            <div className="admin-operations-highlight-main">
              <div className="admin-operations-highlight-copy">
              <p className="admin-secondary-page-kicker">Readiness</p>
              <h3>Configuration review</h3>
              <div className="admin-operations-highlight-lines">
                <p>Branches online: {activeBranchesCount}</p>
                <p>Completed service sessions today: {completedAppointmentsCount}</p>
              </div>
            </div>

            <div className="admin-operations-highlight-tags" aria-label="Current settings context">
              <span>Hardware sync</span>
              <span>Role access</span>
              <span>Alert routing</span>
            </div>

            <div className="admin-operations-highlight-details">
              <article className="admin-operations-highlight-detail-card">
                <span>Branch network</span>
                <strong>{activeBranchesCount} online</strong>
              </article>
              <article className="admin-operations-highlight-detail-card">
                <span>Staff access</span>
                <strong>{activeStaffCount} active profiles</strong>
              </article>
              <article className="admin-operations-highlight-detail-card">
                <span>Alert coverage</span>
                <strong>{activeServicesCount} rules live</strong>
              </article>
              <article className="admin-operations-highlight-detail-card">
                <span>Appointment visibility</span>
                <strong>{waitingAppointmentsCount} upcoming appointments</strong>
              </article>
            </div>
          </div>

          <div className="admin-operations-highlight-actions">
            <div className="admin-operations-highlight-action-card">
              <span className="admin-operations-highlight-action-label">Next action</span>
              <button
                type="button"
                className="admin-analytics-export"
                onClick={() => setActionMessage("Settings checklist reviewed. Ready to save branch changes.")}
              >
                <CheckCircleIcon />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                className="admin-table-action"
                onClick={() => setActionMessage("Draft settings reset for another review pass.")}
              >
                <NoShowIcon />
                <span>Reset Draft</span>
              </button>
              <p>Review before publish.</p>
            </div>
          </div>

          <div className="admin-operations-highlight-art" aria-hidden="true">
            <QueueIllustrationIcon />
          </div>
        </section>

        <section className="admin-analytics-grid">
          <article className="admin-analytics-panel">
            <div className="admin-analytics-panel-head">
              <div className="admin-panel-heading-copy">
                <h3>Configuration Tasks</h3>
                <p>Current review items.</p>
              </div>
            </div>

            <div className="admin-operations-table">
              <div className="admin-operations-table-head">
                <span>Task</span>
                <span>Area</span>
                <span>Detail</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              {settingsTasks.map((entry) => (
                <div key={entry.ticket} className="admin-operations-table-row">
                  <strong>{entry.ticket}</strong>
                  <span>{entry.customer}</span>
                  <span>{entry.service}</span>
                  <span className={`admin-status-badge is-${entry.status}`.trim()}>
                    {formatStatusLabel(entry.status)}
                  </span>
                  <span className={`admin-row-action is-${entry.status}`.trim()}>{entry.action}</span>
                </div>
              ))}
            </div>
          </article>

          <aside className="admin-analytics-panel">
            <div className="admin-analytics-panel-head">
              <div className="admin-panel-heading-copy">
                <h3>Settings Checklist</h3>
                <p>Before approval.</p>
              </div>
            </div>

            <div className="admin-operations-card-list">
              {settingsChecklist.map((item) => (
                <article
                  key={item.title}
                  className={`admin-operations-card ${item.status === "waiting" ? "is-alert" : ""}`.trim()}
                >
                  <div className="admin-operations-card-top">
                    <span className="admin-appointment-time">{item.status === "completed" ? "Ready" : item.status === "in-progress" ? "Review" : "Pending"}</span>
                    <span className={`admin-status-badge is-${item.status === "in-progress" ? "in-progress" : item.status}`.trim()}>
                      {formatStatusLabel(item.status)}
                    </span>
                  </div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                  <span className="admin-appointment-alert">{item.note}</span>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <p className="admin-analytics-feedback" aria-live="polite">
          {actionMessage}
        </p>
      </section>
    );
  }

  return (
    <section className="admin-analytics-page admin-secondary-page">
      {loadError ? (
        <p className="auth-error-message" aria-live="polite">
          {loadError}
        </p>
      ) : null}

      <header className="admin-analytics-hero">
        <div className="admin-analytics-hero-copy">
          <p className="admin-secondary-page-kicker">Operations</p>
          <h2>{secondaryContent.pageTitle}</h2>
          <p>{secondaryContent.pageDescription}</p>
        </div>

        <div className="admin-analytics-hero-actions">
          <Link href={secondaryContent.pageLinkHref} className="admin-table-action">
            {secondaryContent.pageLinkLabel}
          </Link>
        </div>
      </header>

      <section
        className="admin-analytics-stats-grid admin-analytics-stats-grid-secondary"
        aria-label={`${secondaryContent.pageTitle} summary`}
      >
        {adminStats.map((stat, index) => (
          <article key={stat.label} className="admin-analytics-stat-card">
            <div className="admin-analytics-stat-top">
              <span className="admin-analytics-stat-icon" aria-hidden="true">
                <MetricIcon icon={index === 0 ? "volume" : index === 1 ? "wait" : "service"} />
              </span>
              <span className={`admin-analytics-pill is-${mapTrendTone(stat.trendTone)}`.trim()}>{stat.trend}</span>
            </div>

            <div className="admin-analytics-stat-copy">
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="admin-analytics-panel admin-operations-highlight">
        <div className="admin-operations-highlight-main">
          <div className="admin-operations-highlight-copy">
            <p className="admin-secondary-page-kicker">{secondaryContent.highlightKicker}</p>
            <h3>{secondaryContent.servingTitle}</h3>
            <div className="admin-operations-highlight-lines">
              {secondaryContent.servingLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="admin-operations-highlight-tags" aria-label="Current task context">
            {secondaryContent.metaTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div className="admin-operations-highlight-details">
            {secondaryContent.servingLines.map((line) => {
              const detail = parseHighlightDetail(line);

              return (
                <article key={line} className="admin-operations-highlight-detail-card">
                  <span>{detail.label}</span>
                  <strong>{detail.value}</strong>
                </article>
              );
            })}
          </div>
        </div>

        <div className="admin-operations-highlight-actions">
          <div className="admin-operations-highlight-action-card">
            <span className="admin-operations-highlight-action-label">Next action</span>
            <button type="button" className="admin-analytics-export">
              <CheckCircleIcon />
              <span>{secondaryContent.primaryAction}</span>
            </button>
            <button type="button" className="admin-table-action">
              <NoShowIcon />
              <span>{secondaryContent.secondaryAction}</span>
            </button>
            <p>{secondaryContent.actionNote}</p>
          </div>
        </div>

        <div className="admin-operations-highlight-art" aria-hidden="true">
          <QueueIllustrationIcon />
        </div>
      </section>

      <section className="admin-analytics-grid">
        <article className="admin-analytics-panel">
          <div className="admin-analytics-panel-head">
            <div className="admin-panel-heading-copy">
              <h3>{secondaryContent.queueTitle}</h3>
              <p>Live items.</p>
            </div>
            <Link href={secondaryContent.pageLinkHref} className="admin-inline-link">
              {secondaryContent.pageLinkLabel}
            </Link>
          </div>

          <div className="admin-operations-table">
            <div className="admin-operations-table-head">
              <span>Ticket</span>
              <span>Customer</span>
              <span>Service</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {liveQueueEntries.map((entry) => (
              <div
                key={entry.ticket}
                className={`admin-operations-table-row ${entry.status === "in-progress" ? "is-highlighted" : ""}`.trim()}
              >
                <strong>{entry.ticket}</strong>
                <span>{entry.customer}</span>
                <span>{entry.service}</span>
                <span className={`admin-status-badge is-${entry.status}`.trim()}>
                  {formatStatusLabel(entry.status)}
                </span>
                <span className={`admin-row-action is-${entry.status}`.trim()}>{entry.action}</span>
              </div>
            ))}
          </div>
        </article>

        <aside className="admin-analytics-panel">
          <div className="admin-analytics-panel-head">
            <div className="admin-panel-heading-copy">
              <h3>{secondaryContent.sideTitle}</h3>
              <p>Next items.</p>
            </div>
          </div>

          <div className="admin-operations-card-list">
            {todayAppointments.map((appointment) => (
              <article
                key={`${appointment.time}-${appointment.customer}`}
                className={`admin-operations-card ${appointment.status === "delayed" ? "is-alert" : ""}`.trim()}
              >
                <div className="admin-operations-card-top">
                  <span className="admin-appointment-time">{appointment.time}</span>
                  <span className={`admin-status-badge is-${appointment.status === "checked-in" ? "completed" : appointment.status === "delayed" ? "waiting" : "in-progress"}`.trim()}>
                    {appointment.status === "checked-in" ? "Checked In" : appointment.status === "delayed" ? "Delayed" : "Upcoming"}
                  </span>
                </div>
                <strong>{appointment.customer}</strong>
                <p>{appointment.service}</p>

                {appointment.status === "delayed" ? (
                  <span className="admin-appointment-alert">Delayed (No-show?)</span>
                ) : (
                  <div className="admin-appointment-actions">
                    <button type="button" className="admin-ghost-button">
                      Notify
                    </button>
                    <button type="button" className="admin-primary-mini">
                      Check-In
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </aside>
      </section>
    </section>
  );
}
