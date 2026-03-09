import Link from "next/link";

type RoleCardProps = {
  href: string;
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
};

export function RoleCard({ href, title, description, bullets, ctaLabel }: RoleCardProps) {
  return (
    <article className="feature-card">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <ul className="bullet-list">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      <div className="cta-row">
        <Link className="button" href={href}>
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}
