"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  clearStoredAuth,
  getAdminAppointments,
  getAdminNotifications,
  getAdminOverview,
  getAdminUnreadNotificationCount,
  getBranches,
  markAdminNotificationRead,
  readStoredDisplayName,
  readStoredPermissions,
  readStoredRole,
  readStoredRoleLabel,
  type AdminAppointmentSummary,
  type AdminNotificationSummary,
  type AdminOverview,
  type BranchSummary,
} from "@/shared/lib/api";

type AdminWorkspaceShellProps = {
  activeItem: "dashboard" | "staff" | "services" | "appointments" | "settings" | "queue";
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

function StaffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M16 11a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-8 0a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm4-8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c2.86 0 8 1.43 8 4.29V19H4v-1.71C4 14.43 9.14 13 12 13Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ServicesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m6 4 3 3-2 2-3-3 2-2Zm9 9 5-5 2 2-5 5-2-2ZM4 20l6-6 2 2-6 6H4v-2Zm7-12 3-3 6 6-3 3-6-6Z"
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
    label: "Overview",
    description: "Live branch performance",
    href: "/portal?role=admin",
    icon: <DashboardIcon />,
  },
  {
    id: "staff",
    label: "Staff",
    description: "Personnel and workload",
    href: "/portal?role=admin&section=staff",
    icon: <StaffIcon />,
  },
  {
    id: "services",
    label: "Services",
    description: "Catalog and capacity",
    href: "/portal?role=admin&section=services",
    icon: <ServicesIcon />,
  },
  {
    id: "appointments",
    label: "Appointments",
    description: "Bookings and arrivals",
    href: "/portal/branches?role=admin",
    icon: <CalendarIcon />,
  },
  {
    id: "settings",
    label: "Settings",
    description: "Devices and alerts",
    href: "/portal?role=admin&section=settings",
    icon: <SettingsIcon />,
  },
] as const;

const workspaceTitles: Record<AdminWorkspaceShellProps["activeItem"], string> = {
  dashboard: "Analytics Overview",
  staff: "Staff Management",
  services: "Service Configuration",
  appointments: "Appointments",
  settings: "Branch Settings",
  queue: "Queue Board",
};

const workspaceDescriptions: Record<AdminWorkspaceShellProps["activeItem"], string> = {
  dashboard: "Branch performance and live load.",
  staff: "Personnel and branch assignments.",
  services: "Service catalog and slot configuration.",
  appointments: "Bookings and calendar flow.",
  settings: "Devices, roles, and alerts.",
  queue: "Live queue and handoff status.",
};

const workspaceActions: Record<
  AdminWorkspaceShellProps["activeItem"],
  { label: string; href: string; note: string }
> = {
  dashboard: {
    label: "Open Dashboard",
    href: "/portal?role=admin",
    note: "Review performance trends.",
  },
  staff: {
    label: "Open Staff",
    href: "/portal?role=admin&section=staff",
    note: "Check availability and workload.",
  },
  services: {
    label: "Open Services",
    href: "/portal?role=admin&section=services",
    note: "Adjust durations and active services.",
  },
  appointments: {
    label: "Open Schedule",
    href: "/portal/branches?role=admin",
    note: "Review daily bookings.",
  },
  settings: {
    label: "Open Settings",
    href: "/portal?role=admin&section=settings",
    note: "Check devices and alerts.",
  },
  queue: {
    label: "Open Queue",
    href: "/portal/bookings?role=admin",
    note: "Process waiting customers.",
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

function formatBranchOfficeLabel(branch: BranchSummary | null) {
  if (!branch) {
    return "HQ-Office-00";
  }

  return `HQ-Office-${String(branch.id).padStart(2, "0")}`;
}

export function AdminWorkspaceShell({ activeItem, children }: AdminWorkspaceShellProps) {
  const router = useRouter();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [primaryBranch, setPrimaryBranch] = useState<BranchSummary | null>(null);
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [appointments, setAppointments] = useState<AdminAppointmentSummary[]>([]);
  const [notifications, setNotifications] = useState<AdminNotificationSummary[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [displayName, setDisplayName] = useState("Admin User");
  const [roleLabel, setRoleLabel] = useState("Admin session");
  const [permissionCount, setPermissionCount] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const storedName = readStoredDisplayName();
    const storedRole = readStoredRole();
    const storedRoleLabel = readStoredRoleLabel();
    const storedPermissions = readStoredPermissions();

    setDisplayName(storedName && storedName.trim().length > 0 ? storedName : "Admin User");
    setRoleLabel(
      storedRoleLabel && storedRoleLabel.trim().length > 0
        ? storedRoleLabel
        : formatStoredRoleLabel(storedRole),
    );
    setPermissionCount(storedPermissions.length);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSidebarData() {
      try {
        const [branchData, appointmentData, overviewData] = await Promise.all([
          getBranches(),
          getAdminAppointments().catch(() => []),
          getAdminOverview().catch(() => null),
        ]);

        if (!isMounted) {
          return;
        }

        setBranches(branchData);
        setPrimaryBranch(branchData[0] ?? null);
        setAppointments(appointmentData);
        setOverview(overviewData);
      } catch {
        if (!isMounted) {
          return;
        }

        setBranches([]);
        setPrimaryBranch(null);
        setAppointments([]);
        setOverview(null);
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

  function getNavigationMeta(itemId: (typeof navigationItems)[number]["id"]) {
    if (itemId === "dashboard") {
      return {
        label: branches.length > 0 ? `${branches.length} branches` : "Live sync",
        tone: "neutral",
      } as const;
    }

    if (itemId === "staff") {
      return {
        label: overview?.metrics.activeStaff ? `${overview.metrics.activeStaff} active` : "Syncing",
        tone: "positive",
      } as const;
    }

    if (itemId === "services") {
      return {
        label: overview?.metrics.activeServices ? `${overview.metrics.activeServices} live` : "Catalog",
        tone: "neutral",
      } as const;
    }

    if (itemId === "appointments") {
      return {
        label: appointments.length > 0 ? `${appointments.length} booked` : "Syncing",
        tone: "neutral",
      } as const;
    }

    return {
      label: primaryBranch ? "Online" : "Syncing",
      tone: "positive",
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
              <strong>SmartQ</strong>
              <p>Enterprise Hub</p>
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
                    <span className={`admin-nav-badge is-${getNavigationMeta(item.id).tone}`.trim()}>
                      {getNavigationMeta(item.id).label}
                    </span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="admin-sidebar-action-card">
            <span className="admin-sidebar-label">Quick action</span>
            <strong>{workspaceActions[activeItem].label}</strong>
            <p>{workspaceActions[activeItem].note}</p>
            <Link href={workspaceActions[activeItem].href} className="admin-sidebar-action-link">
              Open Workspace
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
              <p>{roleLabel}{permissionCount > 0 ? ` | ${permissionCount} permissions` : ""}</p>
            </div>
          </div>

          <Link href={workspaceActions[activeItem].href} className="admin-sidebar-footer-link">
            {workspaceActions[activeItem].label}
          </Link>

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
            <strong>Branch Management</strong>
            <p>{workspaceTitles[activeItem]}</p>
          </div>

          <div className="admin-topbar-actions">
            <label className="admin-search-field">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search analytics, staff, or services..."
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

            <button type="button" className="admin-icon-button" aria-label="Help">
              <HelpIcon />
            </button>

            <span className="admin-topbar-divider" aria-hidden="true" />

            <div className="admin-topbar-user">
              <div className="admin-topbar-user-copy">
                <strong>{displayName}</strong>
                <span>
                  {primaryBranch
                    ? formatBranchOfficeLabel(primaryBranch)
                    : workspaceDescriptions[activeItem]}
                </span>
              </div>

              <button
                type="button"
                className="admin-profile-avatar admin-profile-avatar-button"
                aria-label={`${displayName} profile`}
                title={displayName}
              >
                {getInitials(displayName)}
              </button>
            </div>
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
                        <strong>
                          {notification.customerName} booked {notification.service}
                        </strong>
                        <p>{notification.branch}</p>
                      </div>
                      <span>
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(new Date(notification.createdAt))}
                      </span>
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
