export const staffMetrics = [
  {
    label: "Queue Length",
    value: "18",
    detail: "A placeholder for live queue counts once the staff queue endpoint is connected.",
  },
  {
    label: "Current Ticket",
    value: "B-014",
    detail: "Keeps the staff view focused on the active service window.",
  },
  {
    label: "Service Pace",
    value: "7m",
    detail: "Average handling time can later come from operational analytics.",
  },
];

export const queueItems = [
  {
    id: "B-014",
    title: "B-014 - Sokha Chen",
    description: "Loan consultation - In progress",
  },
  {
    id: "B-015",
    title: "B-015 - Maya Patel",
    description: "Account opening - Waiting",
  },
  {
    id: "B-016",
    title: "B-016 - John Rivera",
    description: "Card replacement - Queued",
  },
];

export const counterActions = [
  { className: "status-pill progress", text: "Serving B-014 at Counter 2" },
  { className: "status-pill waiting", text: "B-015 is next in queue" },
  { className: "status-pill done", text: "12 tickets completed today" },
];
