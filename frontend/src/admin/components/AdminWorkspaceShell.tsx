import Link from "next/link";
import type { ReactNode } from "react";
import { adminBranchSnapshot } from "@/admin/lib/workspace-data";

type AdminWorkspaceShellProps = {
  activeItem: "dashboard" | "appointments" | "queue" | "transactions" | "settings" | "help";
  children: ReactNode;
};

function LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 4h8v8H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm8 0h8v2h-8v-2Zm0 4h8v2h-8v-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
        fill="currentColor"
      />
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

function QueueIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6h16v3H4V6Zm0 5h10v3H4v-3Zm0 5h16v3H4v-3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3Zm3 4v2h6V7H9Zm0 4v2h6v-2H9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m12 3 1.2 2.54 2.8.4-2.03 1.97.48 2.79L12 9.47l-2.45 1.29.48-2.79L8 5.94l2.8-.4L12 3Zm0 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-7 3 1.77.94-.34 2.04 2.04-.34L9.4 17.35l1.6-1.32 1.6 1.32 1.93-1.77 2.04.34-.34-2.04L19 12l-1.77-.94.34-2.04-2.04.34L14.6 6.65 13 7.97l-1.6-1.32-1.93 1.77-2.04-.34.34 2.04L5 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3a5 5 0 0 1 5 5v2.1c0 .68.22 1.35.62 1.9l1.08 1.48a1 1 0 0 1-.8 1.59H6.1a1 1 0 0 1-.8-1.6l1.08-1.47c.4-.55.62-1.22.62-1.9V8a5 5 0 0 1 5-5Zm0 18a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 21Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 12.75a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Zm0-8.1c-2.2 0-3.8 1.28-3.8 3.28h2.1c0-.9.64-1.44 1.63-1.44 1 0 1.63.53 1.63 1.39 0 .66-.31 1.03-1.24 1.58-.98.58-1.92 1.34-1.92 3.04v.27h2v-.18c0-.88.35-1.27 1.4-1.9 1.2-.72 1.97-1.56 1.97-3.03 0-1.91-1.53-3.01-3.77-3.01Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0-2a8.5 8.5 0 1 0 5.33 15.12l4.02 4.03 1.42-1.42-4.03-4.02A8.5 8.5 0 0 0 10.5 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", href: "/portal?role=admin", icon: <DashboardIcon /> },
  { id: "appointments", label: "Schedule", href: "/portal/branches?role=admin", icon: <CalendarIcon /> },
  { id: "queue", label: "Queue Board", href: "/portal/bookings?role=admin", icon: <QueueIcon /> },
  {
    id: "transactions",
    label: "Transactions",
    href: "/portal?role=admin&section=transactions",
    icon: <ReceiptIcon />,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/portal?role=admin&section=settings",
    icon: <SettingsIcon />,
  },
] as const;

const supportItems = [
  {
    id: "help",
    label: "Support Center",
    href: "/portal?role=admin&section=help",
    icon: <HelpIcon />,
  },
] as const;

const workspaceTitles: Record<AdminWorkspaceShellProps["activeItem"], string> = {
  dashboard: "Performance Dashboard",
  appointments: "Schedule Management",
  queue: "Queue Operations",
  transactions: "Transaction Oversight",
  settings: "Station Settings",
  help: "Support Center",
};

const workspaceDescriptions: Record<AdminWorkspaceShellProps["activeItem"], string> = {
  dashboard: "Track branch demand, service speed, and staffing performance in one place.",
  appointments: "Manage bookings, upcoming arrivals, and front-desk scheduling activity.",
  queue: "Monitor live ticket flow, queue load, and next-customer actions.",
  transactions: "Review pending approvals, service exceptions, and throughput checkpoints.",
  settings: "Control workstation setup, alerts, and branch operating readiness.",
  help: "Handle support escalations, service blockers, and response priorities.",
};

export function AdminWorkspaceShell({ activeItem, children }: AdminWorkspaceShellProps) {
  return (
    <main className="admin-workspace">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-main">
          <div className="admin-brand">
            <span className="admin-brand-mark" aria-hidden="true">
              <LogoIcon />
            </span>
            <div className="admin-brand-copy">
              <strong>SmartQ Analytics</strong>
              <p>Admin control center</p>
            </div>
          </div>

          <nav className="admin-sidebar-nav" aria-label="Admin workspace">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`admin-nav-link ${activeItem === item.id ? "is-active" : ""}`.trim()}
              >
                <span className="admin-nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="admin-sidebar-secondary">
            {supportItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`admin-secondary-link ${activeItem === item.id ? "is-active" : ""}`.trim()}
              >
                <span className="admin-nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-branch-card">
            <span className="admin-branch-card-label">SmartQ ID</span>
            <strong>
              {adminBranchSnapshot.branchId} - {adminBranchSnapshot.branchName}
            </strong>
            <p>Status: {adminBranchSnapshot.status}</p>
            <div className="admin-branch-card-progress" aria-hidden="true">
              <span style={{ width: `${adminBranchSnapshot.progress}%` }} />
            </div>
          </div>
        </div>
      </aside>

      <section className="admin-content-shell">
        <header className="admin-topbar">
          <div className="admin-topbar-context">
            <span>Current Workspace</span>
            <strong>{workspaceTitles[activeItem]}</strong>
            <p>{workspaceDescriptions[activeItem]}</p>
          </div>

          <div className="admin-topbar-actions">
            <label className="admin-search-field">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search tickets, services, or staff..."
                aria-label="Search admin workspace data"
              />
            </label>

            <button type="button" className="admin-icon-button" aria-label="Notifications">
              <BellIcon />
            </button>

            <button type="button" className="admin-icon-button" aria-label="Settings">
              <SettingsIcon />
            </button>

            <button type="button" className="admin-profile-avatar" aria-label="Admin profile">
              AT
            </button>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </section>
    </main>
  );
}
