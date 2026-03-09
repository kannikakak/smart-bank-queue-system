import { MetricCard } from "@/components/dashboard/metric-card";
import { TimelineList } from "@/components/dashboard/timeline-list";
import { TopNav } from "@/components/dashboard/top-nav";
import { counterActions, queueItems, staffMetrics } from "../data/dashboard";

export function StaffDashboardView() {
  return (
    <main className="page-shell">
      <TopNav
        activeView="staff"
        title="Staff Dashboard"
        subtitle="Live queue handling for branch counters, service calls, and ticket progress."
        links={[
          { href: "/", label: "Home", variant: "secondary" },
          { href: "/login", label: "Staff Login" },
        ]}
      />

      <section className="hero">
        <span className="eyebrow">Staff View</span>
        <h1>Operate the queue from a dedicated branch workspace.</h1>
        <p>
          This route keeps teller and counter-side logic isolated from the customer and admin
          experiences, with its own local data and UI components.
        </p>
      </section>

      <section className="section">
        <div className="dashboard-grid">
          {staffMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="section feature-band">
        <TimelineList items={queueItems} title="Live Queue" />

        <article className="panel info-panel">
          <h2>Counter Actions</h2>
          <div className="stack">
            {counterActions.map((action) => (
              <div className={action.className} key={action.text}>
                {action.text}
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
