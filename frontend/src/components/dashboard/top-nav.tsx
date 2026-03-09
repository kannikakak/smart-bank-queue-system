import Link from "next/link";

type TopNavLink = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type TopNavProps = {
  title: string;
  subtitle: string;
  links?: TopNavLink[];
  activeView?: "customer" | "staff" | "admin";
};

function BrandLockup() {
  return (
    <>
      <strong>SmartQ</strong>
      <span>Banking Queue Platform</span>
    </>
  );
}

function NavActions({ links }: { links: TopNavLink[] }) {
  return (
    <div className="nav-row">
      {links.map((link) => (
        <Link
          className={link.variant === "secondary" ? "button-secondary" : "button"}
          href={link.href}
          key={link.href}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export function TopNav({ title, subtitle, links = [], activeView }: TopNavProps) {
  const roleLinks = [
    { href: "/customer", label: "Customer", value: "customer" },
    { href: "/staff", label: "Staff", value: "staff" },
    { href: "/admin", label: "Admin", value: "admin" },
  ] as const;

  return (
    <header className="top-nav">
      <div className="brand-lockup">
        <BrandLockup />
        <span>{title}</span>
        <span>{subtitle}</span>
      </div>

      <div className="top-nav-actions">
        <nav className="role-switch" aria-label="Role views">
          {roleLinks.map((link) => (
            <Link
              className={activeView === link.value ? "role-switch-link active" : "role-switch-link"}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {links.length > 0 ? <NavActions links={links} /> : null}
      </div>
    </header>
  );
}
