import type { ReactNode } from "react";

type RoleCardProps = {
  title: string;
  subtitle?: string;
  detail?: string;
  icon?: ReactNode;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
};

export function RoleCard({
  title,
  subtitle,
  detail,
  icon,
  badge,
  active = false,
  onClick,
}: RoleCardProps) {
  return (
    <button
      type="button"
      className={active ? "role-card is-active" : "role-card"}
      aria-pressed={active}
      onClick={onClick}
      suppressHydrationWarning
    >
      <span className="role-card-top">
        {icon ? (
          <span className="role-card-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {badge ? <span className="role-card-badge">{badge}</span> : null}
      </span>
      <span className="role-card-title">{title}</span>
      {subtitle ? <span className="role-card-subtitle">{subtitle}</span> : null}
      {detail ? <span className="role-card-detail">{detail}</span> : null}
    </button>
  );
}
