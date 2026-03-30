type RoleCardProps = {
  title: string;
  active?: boolean;
  onClick?: () => void;
};

export function RoleCard({ title, active = false, onClick }: RoleCardProps) {
  return (
    <button
      type="button"
      className={active ? "role-card is-active" : "role-card"}
      aria-pressed={active}
      onClick={onClick}
      suppressHydrationWarning
    >
      {title}
    </button>
  );
}
