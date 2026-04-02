type MetricCardProps = {
  label?: string;
  title: string;
  description: string;
};

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.25 5 5v5.52c0 4.82 2.93 9.26 7 11.23 4.07-1.97 7-6.41 7-11.23V5l-7-2.75Zm3.06 7.48-3.56 4.75a1 1 0 0 1-1.46.14L8.7 13.3a1 1 0 1 1 1.4-1.42l.52.51 2.83-3.77a1 1 0 0 1 1.6 1.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MetricCard({
  label = "Security",
  title,
  description,
}: MetricCardProps) {
  return (
    <article className="security-card" role="article" aria-label="Security feature">
      <div className="security-icon" aria-hidden="true">
        <ShieldIcon />
      </div>
      <div>
        <p className="security-card-label">{label}</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}
