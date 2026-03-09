import { MetricCard } from "@/components/dashboard/metric-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { TimelineList } from "@/components/dashboard/timeline-list";
import { TopNav } from "@/components/dashboard/top-nav";
import { adminMetrics, adminPeakHours, topServices } from "../data/dashboard";

export function AdminDashboardView() {
  return (
    <main className="page-shell">
      <TopNav
        activeView="admin"
        title="Admin Dashboard"
        subtitle="Operations overview for queue performance, service demand, and branch traffic."
        links={[
          { href: "/", label: "Home", variant: "secondary" },
          { href: "/login", label: "Login" },
        ]}
      />

      <section className="hero">
        <span className="eyebrow">Admin View</span>
        <h1>Monitor branch performance with a clean, reusable dashboard structure.</h1>
        <p>
          This route keeps the admin workspace separate from other role views. Replace the static
          placeholders with your analytics endpoint response when the API wiring starts.
        </p>
      </section>

      <section className="section">
        <SectionHeader
          title="Overview Metrics"
          description="Static placeholders shaped for the metrics map returned by the backend."
        />
        <div className="dashboard-grid">
          {adminMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="section feature-band">
        <TimelineList items={adminPeakHours} title="Peak Hours" />

        <article className="panel info-panel">
          <h2>Top Services</h2>
          <p>These items mirror the domain language already present in the catalog and analytics modules.</p>
          <ul className="bullet-list">
            {topServices.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
