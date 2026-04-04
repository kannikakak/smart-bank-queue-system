"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAdminOverview,
  getAdminStaff,
  type AdminOverview,
  type AdminStaffSummary,
} from "@/shared/lib/api";

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

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13h4l2-5 4 10 2-5h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4h10v5l-5 3-5-3V4Zm1 9h8l2 7-6-3-6 3 2-7Z" fill="currentColor" />
    </svg>
  );
}

function formatInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getStatusTone(status: AdminStaffSummary["status"]) {
  if (status === "ONLINE") {
    return "positive";
  }

  if (status === "BUSY") {
    return "accent";
  }

  return "neutral";
}

export function AdminStaffWorkspace() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [staff, setStaff] = useState<AdminStaffSummary[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [actionMessage, setActionMessage] = useState("Personnel data is synced.");
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [overviewResponse, staffResponse] = await Promise.all([
          getAdminOverview(),
          getAdminStaff(),
        ]);

        if (!isMounted) {
          return;
        }

        setOverview(overviewResponse);
        setStaff(staffResponse);
        setLoadError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setLoadError(
          error instanceof Error && error.message
            ? error.message
            : "Unable to load staff management data.",
        );
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleStaff = useMemo(() => {
    return staff.filter((person) => {
      const matchesQuery =
        searchValue.trim().length === 0 ||
        [person.fullName, person.email, person.branch, person.roleTitle, person.status]
          .join(" ")
          .toLowerCase()
          .includes(searchValue.trim().toLowerCase());

      const matchesAvailability = !onlyOnline || person.status === "ONLINE";

      return matchesQuery && matchesAvailability;
    });
  }, [onlyOnline, searchValue, staff]);

  const onlineCount = staff.filter((person) => person.status !== "OFFLINE").length;
  const averageEfficiency = staff.length
    ? Math.round(staff.reduce((total, person) => total + person.efficiencyScore, 0) / staff.length)
    : 0;
  const completedToday = staff.reduce((total, person) => total + person.completedToday, 0);
  const targetReach = Math.min(99, Math.max(65, averageEfficiency + Math.round(onlineCount / 4)));

  const branchLoads = Array.from(
    visibleStaff.reduce((map, person) => {
      map.set(person.branch, (map.get(person.branch) ?? 0) + 1);
      return map;
    }, new Map<string, number>()),
  )
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3);

  const strongestStaff = [...visibleStaff]
    .sort((left, right) => right.efficiencyScore - left.efficiencyScore)
    .slice(0, 4);

  return (
    <section className="admin-system-page admin-modern-page">
      {loadError ? (
        <p className="auth-error-message" aria-live="polite">
          {loadError}
        </p>
      ) : null}

      <header className="admin-modern-hero">
        <div className="admin-modern-hero-copy">
          <p className="admin-system-kicker">Workspace • Personnel Directory</p>
          <h2>Staff Management</h2>
          <p className="admin-system-hero-description">
            Monitor live availability, branch assignments, and completion flow with a lighter operational view.
          </p>
        </div>

        <div className="admin-modern-toolbar">
          <label className="admin-modern-search">
            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search personnel, email, branch, or status..."
              aria-label="Search staff members"
            />
          </label>

          <button
            type="button"
            className={`admin-modern-pill ${onlyOnline ? "is-active" : ""}`.trim()}
            onClick={() => {
              setOnlyOnline((current) => !current);
              setActionMessage(onlyOnline ? "Showing all staff members." : "Showing online staff only.");
            }}
          >
            {onlyOnline ? "Only Online" : "Filter All"}
          </button>
        </div>
      </header>

      <section className="admin-modern-metrics" aria-label="Staff metrics">
        <article className="admin-modern-metric-card">
          <span className="admin-modern-metric-icon">
            <StaffIcon />
          </span>
          <div>
            <p>Total Personnel</p>
            <strong>{overview?.metrics.activeStaff ?? staff.length}</strong>
          </div>
        </article>

        <article className="admin-modern-metric-card">
          <span className="admin-modern-metric-icon is-green">
            <ActivityIcon />
          </span>
          <div>
            <p>Currently Online</p>
            <strong>{onlineCount}</strong>
          </div>
        </article>

        <article className="admin-modern-metric-card">
          <span className="admin-modern-metric-icon is-purple">
            <BadgeIcon />
          </span>
          <div>
            <p>Avg. Efficiency</p>
            <strong>{averageEfficiency}%</strong>
          </div>
        </article>

        <article className="admin-modern-score-card">
          <span>Target Reach</span>
          <strong>{targetReach}%</strong>
          <p>{completedToday} completed sessions logged today.</p>
        </article>
      </section>

      <section className="admin-modern-grid">
        <article className="admin-modern-panel admin-modern-table-panel">
          <div className="admin-modern-panel-head">
            <div>
              <h3>Active Personnel</h3>
              <p>{visibleStaff.length} visible staff members</p>
            </div>
            <button
              type="button"
              className="admin-table-action"
              onClick={() => setActionMessage("Staff status refresh requested.")}
            >
              Update All Status
            </button>
          </div>

          <div className="admin-modern-table">
            <div className="admin-modern-table-head">
              <span>Personnel</span>
              <span>Designation</span>
              <span>Branch</span>
              <span>Status</span>
              <span>Completed</span>
              <span>Load</span>
            </div>

            {visibleStaff.map((person) => (
              <div key={person.id} className="admin-modern-table-row">
                <div className="admin-modern-person">
                  <span className="admin-modern-avatar" aria-hidden="true">
                    {formatInitials(person.fullName)}
                  </span>
                  <div>
                    <strong>{person.fullName}</strong>
                    <span>{person.email}</span>
                  </div>
                </div>

                <span>{person.roleTitle}</span>
                <span>{person.branch}</span>
                <span className={`admin-modern-status is-${getStatusTone(person.status)}`.trim()}>
                  {person.status === "BUSY" ? "Busy" : person.status === "ONLINE" ? "Online" : "Offline"}
                </span>
                <span>{person.completedToday}</span>

                <div className="admin-modern-progress">
                  <span>
                    <i style={{ width: `${person.efficiencyScore}%` }} />
                  </span>
                  <strong>{person.activeAppointments}</strong>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="admin-modern-side-stack">
          <article className="admin-modern-panel">
            <div className="admin-modern-panel-head">
              <div>
                <h3>Resource Utilization</h3>
                <p>Staff distribution by branch.</p>
              </div>
            </div>

            <div className="admin-modern-load-list">
              {branchLoads.map(([branch, count]) => {
                const percentage = visibleStaff.length > 0 ? Math.round((count / visibleStaff.length) * 100) : 0;

                return (
                  <div key={branch} className="admin-modern-load-row">
                    <div>
                      <strong>{branch}</strong>
                      <span>{count} staff assigned</span>
                    </div>
                    <div className="admin-modern-load-meter">
                      <span>
                        <i style={{ width: `${percentage}%` }} />
                      </span>
                      <strong>{percentage}%</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="admin-modern-panel admin-modern-dark-panel">
            <div className="admin-modern-panel-head">
              <div>
                <h3>Staff Notifications</h3>
                <p>Immediate branch actions.</p>
              </div>
            </div>

            <div className="admin-modern-notice-list">
              {strongestStaff.slice(0, 3).map((person) => (
                <div key={person.id} className="admin-modern-notice-card">
                  <strong>{person.fullName}</strong>
                  <p>
                    {person.roleTitle} in {person.branch} is tracking at {person.efficiencyScore}% efficiency.
                  </p>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <p className="admin-analytics-feedback" aria-live="polite">
        {actionMessage}
      </p>
    </section>
  );
}
