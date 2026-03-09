import { heroMetrics, heroQueueItems } from "../data/homepage";
import { CustomerIcon } from "./customer-icons";

type CustomerHeroProps = {
  displayName: string;
};

export function CustomerHero({ displayName }: CustomerHeroProps) {
  const firstName = displayName.split(" ").find(Boolean) ?? "Customer";

  return (
    <section className="customer-hero" id="book-now">
      <div className="customer-hero-card">
        <div className="customer-hero-copy">
          <span className="customer-eyebrow">Discovery Center</span>
          <h1>
            Banking services, <span>reimagined</span> for you.
          </h1>
          <p>
            Explore our comprehensive financial solutions. Transparent wait times, clear
            requirements, and seamless booking.
          </p>
          <div className="customer-welcome-note">
            Welcome back, {firstName}. Your next appointment starts here.
          </div>
          <div className="customer-hero-actions">
            <a className="customer-primary-button" href="#services">
              Start Booking
            </a>
            <a className="customer-secondary-button" href="#support">
              Contact Advisor
            </a>
          </div>

          <div className="customer-hero-trust">
            <span className="customer-hero-trust-dot" />
            <span>Live branch availability updates every 60 seconds.</span>
          </div>
        </div>

        <aside className="customer-hero-panel">
          <div className="customer-hero-panel-head">
            <span className="customer-hero-panel-kicker">Priority Booking</span>
            <strong>Plan your visit before you leave home.</strong>
          </div>

          <div className="customer-hero-spotlight">
            <span className="customer-hero-spotlight-label">Recommended for {firstName}</span>
            <strong>Savings account review</strong>
            <p>Central Branch has the shortest wait window this afternoon.</p>
          </div>

          <div className="customer-hero-queue">
            {heroQueueItems.map((item) => (
              <article className="customer-hero-queue-item" key={item.id}>
                <div className="customer-hero-queue-icon">
                  <CustomerIcon name={item.icon} />
                </div>
                <div className="customer-hero-queue-copy">
                  <span>{item.title}</span>
                  <strong>{item.detail}</strong>
                </div>
              </article>
            ))}
          </div>

          <div className="customer-hero-metrics">
            {heroMetrics.map((metric) => (
              <div className="customer-hero-metric" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </aside>

        <div aria-hidden="true" className="customer-hero-waves">
          <span className="customer-hero-wave customer-hero-wave-one" />
          <span className="customer-hero-wave customer-hero-wave-two" />
          <span className="customer-hero-wave customer-hero-wave-three" />
          <span className="customer-hero-glow" />
        </div>
      </div>
    </section>
  );
}
