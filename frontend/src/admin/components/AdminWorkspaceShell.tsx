"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  clearStoredAuth,
  getAdminAppointments,
  getAdminNotifications,
  getAdminUnreadNotificationCount,
  getBranches,
  markAdminNotificationRead,
  readStoredDisplayName,
  readStoredRole,
  type AdminNotificationSummary,
  type AdminAppointmentSummary,
  type BranchSummary,
} from "@/shared/lib/api";

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
  {
    id: "dashboard",
    label: "Dashboard",
    description: "KPIs and branch load",
    href: "/portal?role=admin",
    icon: <DashboardIcon />,
  },
  {
    id: "appointments",
    label: "Schedule",
    description: "Bookings and arrivals",
    href: "/portal/branches?role=admin",
    icon: <CalendarIcon />,
  },
  {
    id: "queue",
    label: "Consultations",
    description: "Live queue board",
    href: "/portal/bookings?role=admin",
    icon: <QueueIcon />,
  },
  {
    id: "transactions",
    label: "Transactions",
    description: "Reviews and exceptions",
    href: "/portal?role=admin&section=transactions",
    icon: <ReceiptIcon />,
  },
  {
    id: "settings",
    label: "Settings",
    description: "Devices and alerts",
    href: "/portal?role=admin&section=settings",
    icon: <SettingsIcon />,
  },
] as const;

const supportItems = [
  {
    id: "help",
    label: "Support Center",
    description: "Escalations",
    href: "/portal?role=admin&section=help",
    icon: <HelpIcon />,
  },
] as const;

const workspaceTitles: Record<AdminWorkspaceShellProps["activeItem"], string> = {
  dashboard: "Performance Dashboard",
  appointments: "Schedule Management",
  queue: "Consultation Board",
  transactions: "Transaction Oversight",
  settings: "Experience Settings",
  help: "Support Center",
};

const workspaceDescriptions: Record<AdminWorkspaceShellProps["activeItem"], string> = {
  dashboard: "Branch performance and live load.",
  appointments: "Bookings and calendar flow.",
  queue: "Live queue and handoff status.",
  transactions: "Approvals and review items.",
  settings: "Devices, roles, and alerts.",
  help: "Support and escalations.",
};

const workspaceActions: Record<
  AdminWorkspaceShellProps["activeItem"],
  { label: string; href: string; note: string }
> = {
  dashboard: {
    label: "Open Queue",
    href: "/portal/bookings?role=admin",
    note: "Move from KPIs to live handling.",
  },
  appointments: {
    label: "Open Schedule",
    href: "/portal/branches?role=admin",
    note: "Review daily bookings.",
  },
  queue: {
    label: "Open Board",
    href: "/portal/bookings?role=admin",
    note: "Process waiting customers.",
  },
  transactions: {
    label: "Open Reviews",
    href: "/portal?role=admin&section=transactions",
    note: "Handle pending review items.",
  },
  settings: {
    label: "Open Settings",
    href: "/portal?role=admin&section=settings",
    note: "Check devices and alerts.",
  },
  help: {
    label: "Open Support",
    href: "/portal?role=admin&section=help",
    note: "Handle urgent issues.",
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatStoredRoleLabel(role: string | null) {
  if (!role) {
    return "Admin session";
  }

  return `${role.charAt(0).toUpperCase()}${role.slice(1)} account`;
}

export function AdminWorkspaceShell({ activeItem, children }: AdminWorkspaceShellProps) {
  const router = useRouter();
  const [primaryBranch, setPrimaryBranch] = useState<BranchSummary | null>(null);
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [appointments, setAppointments] = useState<AdminAppointmentSummary[]>([]);
  const [notifications, setNotifications] = useState<AdminNotificationSummary[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [displayName, setDisplayName] = useState("Admin User");
  const [roleLabel, setRoleLabel] = useState("Admin session");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const storedName = readStoredDisplayName();
    const storedRole = readStoredRole();

    setDisplayName(storedName && storedName.trim().length > 0 ? storedName : "Admin User");
    setRoleLabel(formatStoredRoleLabel(storedRole));
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSidebarData() {
      try {
        const [branchData, appointmentData] = await Promise.all([
          getBranches(),
          getAdminAppointments().catch(() => []),
        ]);

        if (isMounted) {
          setBranches(branchData);
          setPrimaryBranch(branchData[0] ?? null);
          setAppointments(appointmentData);
        }
      } catch {
        if (isMounted) {
          setBranches([]);
          setPrimaryBranch(null);
          setAppointments([]);
        }
      }
    }

    void loadSidebarData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      try {
        const [notificationData, unreadData] = await Promise.all([
          getAdminNotifications(),
          getAdminUnreadNotificationCount(),
        ]);

        if (!isMounted) {
          return;
        }

        setNotifications(notificationData);
        setUnreadNotifications(unreadData.unreadCount);
      } catch {
        if (!isMounted) {
          return;
        }

        setNotifications([]);
        setUnreadNotifications(0);
      }
    }

    void loadNotifications();
    const intervalId = window.setInterval(() => {
      void loadNotifications();
    }, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const waitingAppointments = appointments.filter(
    (appointment) => appointment.status === "WAITING",
  ).length;
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "COMPLETED",
  ).length;

  function getNavigationMeta(itemId: (typeof navigationItems)[number]["id"] | "help") {
    if (itemId === "dashboard") {
      return {
        label: branches.length > 0 ? `${branches.length} branches` : "Live sync",
        tone: "neutral",
      } as const;
    }

    if (itemId === "appointments") {
      return {
        label: appointments.length > 0 ? `${appointments.length} booked` : "Syncing",
        tone: "neutral",
      } as const;
    }

    if (itemId === "queue") {
      return {
        label: waitingAppointments > 0 ? `${waitingAppointments} arriving` : "Clear",
        tone: waitingAppointments > 0 ? "alert" : "positive",
      } as const;
    }

    if (itemId === "transactions") {
      return {
        label: completedAppointments > 0 ? `${completedAppointments} closed` : "Review",
        tone: "neutral",
      } as const;
    }

    if (itemId === "settings") {
      return {
        label: primaryBranch ? "Online" : "Syncing",
        tone: "positive",
      } as const;
    }

    return {
      label: waitingAppointments > 2 ? "Priority" : "Standby",
      tone: waitingAppointments > 2 ? "alert" : "neutral",
    } as const;
  }

  async function handleNotificationClick(notification: AdminNotificationSummary) {
    if (notification.status !== "UNREAD") {
      setIsNotificationsOpen(false);
      return;
    }

    try {
      await markAdminNotificationRead(notification.id);
      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item.id === notification.id ? { ...item, status: "READ" } : item,
        ),
      );
      setUnreadNotifications((currentCount) => Math.max(0, currentCount - 1));
    } catch {
      // Keep the notification visible even if the read-state update fails.
    } finally {
      setIsNotificationsOpen(false);
    }
  }

  function handleLogout() {
    setIsNotificationsOpen(false);
    setIsLoggingOut(true);
    clearStoredAuth();
    router.replace("/");
  }

  return (
    <main className="admin-workspace">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-main">
          <div className="admin-brand">
            <span className="admin-brand-mark" aria-hidden="true">
              <LogoIcon />
            </span>
          <div className="admin-brand-copy">
              <strong>SmartQ Admin</strong>
              <p>Operations console</p>
          </div>
          </div>

          <div className="admin-sidebar-group">
            <p className="admin-sidebar-label">Workspace</p>
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
                  <span className="admin-nav-content">
                    <span className="admin-nav-copy">
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                    <span
                      className={`admin-nav-badge is-${getNavigationMeta(item.id).tone}`.trim()}
                    >
                      {getNavigationMeta(item.id).label}
                    </span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="admin-sidebar-group">
            <p className="admin-sidebar-label">System</p>
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
                  <span className="admin-nav-content">
                    <span className="admin-nav-copy">
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                    <span
                      className={`admin-nav-badge is-${getNavigationMeta(item.id).tone}`.trim()}
                    >
                      {getNavigationMeta(item.id).label}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="admin-sidebar-action-card">
            <span className="admin-sidebar-label">Quick action</span>
            <strong>{workspaceTitles[activeItem]}</strong>
            <p>{workspaceActions[activeItem].note}</p>
            <Link href={workspaceActions[activeItem].href} className="admin-sidebar-action-link">
              {workspaceActions[activeItem].label}
            </Link>
          </div>
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-branch-card">
            <span className="admin-branch-card-label">SmartQ ID</span>
            <strong>
              {primaryBranch ? `#${primaryBranch.id} - ${primaryBranch.name}` : "Loading - Branch"}
            </strong>
            <p>Status: {primaryBranch ? "Appointment network online" : "Syncing live branch data"}</p>
            <div className="admin-branch-card-progress" aria-hidden="true">
              <span
                style={{
                  width: `${primaryBranch ? Math.min(primaryBranch.activeCounters * 18, 100) : 24}%`,
                }}
              />
            </div>
          </div>

          <div className="admin-profile-card">
            <span className="admin-profile-avatar" aria-hidden="true">
              {getInitials(displayName)}
            </span>
            <div>
              <strong>{displayName}</strong>
              <p>{roleLabel}</p>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </aside>

      <section className="admin-content-shell">
        <header className="admin-topbar">
          <div className="admin-topbar-context">
            <span>Workspace</span>
            <strong>{workspaceTitles[activeItem]}</strong>
            <p>{workspaceDescriptions[activeItem]}</p>
          </div>

          <div className="admin-topbar-actions">
            <span className="admin-topbar-pill">
              {primaryBranch ? primaryBranch.name : "Live branch sync"}
            </span>

            <label className="admin-search-field">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search bookings, services, staff..."
                aria-label="Search admin workspace data"
              />
            </label>

            <button
              type="button"
              className="admin-icon-button admin-notification-button"
              aria-label="Notifications"
              onClick={() => setIsNotificationsOpen((current) => !current)}
            >
              <BellIcon />
              {unreadNotifications > 0 ? (
                <span className="admin-notification-dot">{unreadNotifications}</span>
              ) : null}
            </button>

            <button type="button" className="admin-icon-button" aria-label="Settings">
              <SettingsIcon />
            </button>

            <button
              type="button"
              className="admin-profile-avatar admin-profile-avatar-button"
              aria-label={`${displayName} profile`}
              title={displayName}
            >
              {getInitials(displayName)}
            </button>
          </div>

          {isNotificationsOpen ? (
            <div className="admin-notification-panel">
              <div className="admin-notification-panel-head">
                <div>
                  <span>Admin alerts</span>
                  <strong>{unreadNotifications} unread</strong>
                </div>
                <Link href="/portal/bookings?role=admin" onClick={() => setIsNotificationsOpen(false)}>
                  Open board
                </Link>
              </div>

              <div className="admin-notification-list">
                {notifications.length === 0 ? (
                  <div className="admin-notification-empty">
                    <strong>No alerts yet.</strong>
                    <p>New customer bookings will appear here.</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href="/portal/bookings?role=admin"
                      className={`admin-notification-item ${notification.status === "UNREAD" ? "is-unread" : ""}`.trim()}
                      onClick={() => void handleNotificationClick(notification)}
                    >
                      <div className="admin-notification-item-copy">
                        <strong>{notification.customerName} booked {notification.service}</strong>
                        <p>{notification.branch}</p>
                      </div>
                      <span>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(notification.createdAt))}</span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </header>

        <div className="admin-content">{children}</div>
      </section>
    </main>
  );
}
