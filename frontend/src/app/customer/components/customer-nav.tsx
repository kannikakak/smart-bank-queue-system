"use client";

import { useRouter } from "next/navigation";
import { CustomerIcon } from "./customer-icons";
import { customerNavLinks } from "../data/homepage";
import { clearSession, type SmartQSession } from "@/lib/auth-session";

type CustomerNavProps = {
  session: SmartQSession;
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export function CustomerNav({
  session,
  searchQuery,
  onSearchChange,
}: CustomerNavProps) {
  const router = useRouter();
  const initials =
    session.displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "CU";

  function handleSignOut() {
    clearSession();
    router.replace("/login");
  }

  return (
    <header className="customer-nav">
      <div className="customer-nav-shell">
        <div className="customer-nav-brand">
          <div className="customer-nav-brand-icon">
            <CustomerIcon name="bank" />
          </div>
          <strong>SmartQ</strong>
        </div>

        <nav className="customer-nav-links" aria-label="Customer navigation">
          {customerNavLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="customer-nav-actions">
          <label className="customer-search-shell customer-search-shell-nav">
            <CustomerIcon name="search" />
            <input
              aria-label="Find a service"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search savings, loans, transfers..."
              type="search"
              value={searchQuery}
            />
          </label>

          <div className="customer-account-pill" aria-label="Signed in customer">
            <span className="customer-avatar">{initials}</span>
            <div className="customer-account-pill-copy">
              <strong>{session.displayName}</strong>
              <span>{session.email}</span>
            </div>
          </div>

          <button className="customer-login-chip" onClick={handleSignOut} type="button">
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
