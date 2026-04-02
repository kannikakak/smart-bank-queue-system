export type AdminStat = {
  label: string;
  value: string;
  trend: string;
  trendTone: "lime" | "orange" | "green" | "slate";
  spotlight?: boolean;
};

export type QueueEntry = {
  ticket: string;
  customer: string;
  service: string;
  status: "waiting" | "in-progress" | "completed";
  action: string;
};

export type AppointmentEntry = {
  time: string;
  customer: string;
  service: string;
  status: "checked-in" | "upcoming" | "delayed";
};

export type AppointmentScheduleEntry = {
  date: string;
  time: string;
  customer: string;
  service: string;
  status: "checked-in" | "scheduled";
  reference: string;
  email: string;
  note: string;
  duration: string;
  priority?: "priority";
};

export type CompletedAppointmentEntry = {
  reference: string;
  date: string;
  customer: string;
  time: string;
  service: string;
  summaryLabel: string;
};

export type AnalyticsBar = {
  id: string;
  label: string;
  value: number;
  tone: "solid" | "muted" | "striped";
  note?: string;
};

export type ReminderCard = {
  title: string;
  detail: string;
  time: string;
  action: string;
};

export type TeamMember = {
  name: string;
  role: string;
  task: string;
  status: "completed" | "in-progress" | "pending";
};

export type PriorityTask = {
  title: string;
  due: string;
  color: "blue" | "teal" | "amber" | "violet";
};

export type DashboardMetric = {
  label: string;
  value: string;
  delta: string;
  deltaTone: "positive" | "neutral" | "alert";
  icon: "wait" | "volume" | "service" | "peak";
};

export type DemandBar = {
  hour: string;
  value: number;
  highlight?: boolean;
};

export type StaffEfficiencyEntry = {
  name: string;
  role: string;
  score: number;
};

export type ServicePerformanceEntry = {
  service: string;
  tickets: number;
  avgWait: string;
  avgDuration: string;
  satisfaction: number;
  staffAssigned: string[];
};

export type BranchSnapshot = {
  branchId: string;
  branchName: string;
  status: string;
  progress: number;
};

export const adminStats: AdminStat[] = [
  {
    label: "Daily Appointments",
    value: "18",
    trend: "4 Pending",
    trendTone: "lime",
  },
  {
    label: "Awaiting Arrival",
    value: "07",
    trend: "Avg. 12m",
    trendTone: "orange",
  },
  {
    label: "Completed Today",
    value: "24",
    trend: "+12% vs yesterday",
    trendTone: "green",
  },
];

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "Avg. Wait Time",
    value: "14m 20s",
    delta: "-12% vs last week",
    deltaTone: "positive",
    icon: "wait",
  },
  {
    label: "Daily Customer Volume",
    value: "1,248",
    delta: "+8% vs last week",
    deltaTone: "positive",
    icon: "volume",
  },
  {
    label: "Avg. Service Time",
    value: "8m 45s",
    delta: "Stable",
    deltaTone: "neutral",
    icon: "service",
  },
  {
    label: "Peak Hours Today",
    value: "11:00 - 13:00",
    delta: "Alert",
    deltaTone: "alert",
    icon: "peak",
  },
];

export const dashboardDemandBars: DemandBar[] = [
  { hour: "09:00", value: 34 },
  { hour: "10:00", value: 43 },
  { hour: "11:00", value: 76, highlight: true },
  { hour: "12:00", value: 88, highlight: true },
  { hour: "13:00", value: 82, highlight: true },
  { hour: "14:00", value: 52 },
  { hour: "15:00", value: 47 },
  { hour: "16:00", value: 29 },
];

export const staffEfficiencyEntries: StaffEfficiencyEntry[] = [
  { name: "Sarah Miller", role: "Teller", score: 94 },
  { name: "John Davids", role: "Loans", score: 88 },
  { name: "Emily Chen", role: "Account Services", score: 91 },
  { name: "Michael Scott", role: "Manager", score: 76 },
  { name: "Elena Rodriguez", role: "Teller", score: 82 },
];

export const servicePerformanceEntries: ServicePerformanceEntry[] = [
  {
    service: "Account Opening",
    tickets: 42,
    avgWait: "12m",
    avgDuration: "25m",
    satisfaction: 5,
    staffAssigned: ["Sarah Miller", "Elena Rodriguez", "John Davids"],
  },
  {
    service: "Loan Consultation",
    tickets: 18,
    avgWait: "20m",
    avgDuration: "45m",
    satisfaction: 4,
    staffAssigned: ["John Davids", "Michael Scott"],
  },
  {
    service: "Card Services",
    tickets: 36,
    avgWait: "9m",
    avgDuration: "15m",
    satisfaction: 5,
    staffAssigned: ["Emily Chen", "Sarah Miller"],
  },
  {
    service: "Wire Transfers",
    tickets: 24,
    avgWait: "14m",
    avgDuration: "18m",
    satisfaction: 4,
    staffAssigned: ["Elena Rodriguez", "Emily Chen", "Michael Scott"],
  },
];

export const adminBranchSnapshot: BranchSnapshot = {
  branchId: "#402",
  branchName: "Downtown",
  status: "Operational",
  progress: 72,
};

export const liveQueueEntries: QueueEntry[] = [
  {
    ticket: "Q-043",
    customer: "Sarah Jenkins",
    service: "Wire Transfer",
    status: "waiting",
    action: "Call Next",
  },
  {
    ticket: "Q-044",
    customer: "Robert Wilson",
    service: "New Card Issue",
    status: "waiting",
    action: "Call Next",
  },
  {
    ticket: "Q-042",
    customer: "Michael Chen",
    service: "Business Loan",
    status: "in-progress",
    action: "Active",
  },
  {
    ticket: "Q-041",
    customer: "Elena Rodriguez",
    service: "Account Opening",
    status: "completed",
    action: "Done",
  },
];

export const todayAppointments: AppointmentEntry[] = [
  {
    time: "11:30 AM",
    customer: "David Miller",
    service: "Mortgage Discussion",
    status: "upcoming",
  },
  {
    time: "12:15 PM",
    customer: "Jessica Taylor",
    service: "Safe Deposit Box",
    status: "checked-in",
  },
  {
    time: "10:00 AM",
    customer: "Alan Walker",
    service: "Investment Planning",
    status: "delayed",
  },
];

export const appointmentScheduleEntries: AppointmentScheduleEntry[] = [
  {
    date: "2026-03-15",
    time: "10:30 AM",
    customer: "Sarah Jenkins",
    service: "Personal Banking",
    status: "checked-in",
    reference: "SQ-9421",
    email: "personal_banking@email.com",
    note: "Account Audit & Setup",
    duration: "45m",
    priority: "priority",
  },
  {
    date: "2026-03-15",
    time: "11:15 AM",
    customer: "Michael Roberts",
    service: "Mortgage Loan",
    status: "scheduled",
    reference: "SQ-8832",
    email: "m.roberts@corporate.com",
    note: "Initial Consultation",
    duration: "60m",
  },
  {
    date: "2026-03-15",
    time: "01:00 PM",
    customer: "Elena Rodriguez",
    service: "Business Account",
    status: "scheduled",
    reference: "SQ-1105",
    email: "elena.rod@webmail.co",
    note: "Signature Update",
    duration: "30m",
  },
];

export const completedAppointments: CompletedAppointmentEntry[] = [
  {
    reference: "SQ-9012",
    date: "2026-03-15",
    customer: "David Chen",
    time: "09:15 AM",
    service: "Personal Banking",
    summaryLabel: "View Summary",
  },
  {
    reference: "SQ-9018",
    date: "2026-03-15",
    customer: "Lisa Thompson",
    time: "10:00 AM",
    service: "Account Setup",
    summaryLabel: "View Summary",
  },
];

export const adminBranches = [
  {
    name: "Downtown Branch",
    desks: "6 active desks",
    status: "Queue healthy",
  },
  {
    name: "Riverside Branch",
    desks: "4 active desks",
    status: "Specialist slots filling",
  },
  {
    name: "Airport Priority Desk",
    desks: "Priority team online",
    status: "Fast-lane service ready",
  },
];

export const analyticsBars: AnalyticsBar[] = [
  { id: "sun", label: "S", value: 68, tone: "striped" },
  { id: "mon", label: "M", value: 76, tone: "solid" },
  { id: "tue", label: "T", value: 74, tone: "muted", note: "74%" },
  { id: "wed", label: "W", value: 88, tone: "solid" },
  { id: "thu", label: "T", value: 70, tone: "striped" },
  { id: "fri", label: "F", value: 62, tone: "muted" },
  { id: "sat", label: "S", value: 71, tone: "striped" },
];

export const reminderCard: ReminderCard = {
  title: "Branch lead sync",
  detail: "Review advisor allocation and lunch coverage for the midday rush.",
  time: "02:00 PM - 02:30 PM",
  action: "Start Briefing",
};

export const teamMembers: TeamMember[] = [
  {
    name: "Alexandra Deff",
    role: "Operations Lead",
    task: "Reviewing branch service recovery plan",
    status: "completed",
  },
  {
    name: "Edwin Adenike",
    role: "Branch Supervisor",
    task: "Rebalancing advisor coverage and check-in flow",
    status: "in-progress",
  },
  {
    name: "Isaac Oluwatemilorun",
    role: "Appointment Coordinator",
    task: "Confirming delayed appointments and customer callbacks",
    status: "pending",
  },
  {
    name: "David Oshodi",
    role: "Customer Support",
    task: "Handling same-day service escalations",
    status: "in-progress",
  },
];

export const priorityTasks: PriorityTask[] = [
  { title: "Update advisor rotation", due: "Due today", color: "blue" },
  { title: "Review no-show customers", due: "Due 11:45 AM", color: "teal" },
  { title: "Escalate delayed loan case", due: "Due 12:10 PM", color: "amber" },
  { title: "Prepare end-of-day appointment report", due: "Due 04:30 PM", color: "violet" },
];
