export const adminMetrics = [
  {
    label: "Active Branches",
    value: "08",
    detail: "Operational branch dashboards can later be populated from the admin analytics overview endpoint.",
  },
  {
    label: "Peak Hour",
    value: "11 AM",
    detail: "Matches the backend shape where peak hours are tracked as a simple list of strings.",
  },
  {
    label: "Top Service",
    value: "Accounts",
    detail: "Keeps service terminology aligned with the banking service catalog in the backend.",
  },
];

export const adminPeakHours = [
  {
    id: "09-10",
    title: "09:00 - 10:00",
    description: "Prepare extra staff capacity and faster call cycles during this window.",
  },
  {
    id: "11-12",
    title: "11:00 - 12:00",
    description: "Peak lunchtime traffic usually increases teller demand and branch check-ins.",
  },
  {
    id: "15-16",
    title: "15:00 - 16:00",
    description: "Late-afternoon appointment traffic needs queue monitoring before branch close.",
  },
];

export const topServices = ["Open account", "Card replacement", "Loan consultation"];
