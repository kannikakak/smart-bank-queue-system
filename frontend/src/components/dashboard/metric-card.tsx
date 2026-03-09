type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong className="metric">{value}</strong>
      <p>{detail}</p>
    </article>
  );
}
