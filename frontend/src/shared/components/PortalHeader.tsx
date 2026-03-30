"use client";

import Link from "next/link";
import { PortalBankIcon } from "@/shared/components/portal/PortalIcons";
import { usePortalNavigation } from "@/shared/hooks/usePortalNavigation";
import { buildBranchesUrl, buildPortalUrl } from "@/shared/portal/booking-data";
import { getPortalProfileLabel, type PortalRole } from "@/shared/portal/portal-role";

type PortalHeaderProps = {
  role: PortalRole;
  activeItem: "home" | "branches" | "services" | "bookings" | "support";
};

export function PortalHeader({ role, activeItem }: PortalHeaderProps) {
  const { bookingParams, currentItem, goToSection } = usePortalNavigation({ role, activeItem });
  const branchesHref =
    role === "customer" ? buildBranchesUrl(role, bookingParams, "branch-selection") : `/portal/branches?role=${role}`;

  return (
    <header className="portal-nav">
      <Link href={buildPortalUrl(role, bookingParams)} className="portal-brand" aria-label="SmartQ portal home">
        <span className="portal-brand-badge" aria-hidden="true">
          <PortalBankIcon />
        </span>
        <span className="portal-brand-name">SmartQ Bank</span>
      </Link>

      <nav className="portal-links" aria-label="Primary">
        {role === "customer" ? (
          <>
            <button
              type="button"
              className={currentItem === "home" ? "portal-nav-link is-active" : "portal-nav-link"}
              onClick={() => goToSection("home")}
            >
              Home
            </button>

            <Link
              href={branchesHref}
              className={currentItem === "branches" ? "portal-nav-link is-active" : "portal-nav-link"}
            >
              Branches
            </Link>

            <button
              type="button"
              className={currentItem === "services" ? "portal-nav-link is-active" : "portal-nav-link"}
              onClick={() => goToSection("services")}
            >
              Services
            </button>

            <button
              type="button"
              className={currentItem === "bookings" ? "portal-nav-link is-active" : "portal-nav-link"}
              onClick={() => goToSection("bookings")}
            >
              My Bookings
            </button>

            <button
              type="button"
              className={currentItem === "support" ? "portal-nav-link is-active" : "portal-nav-link"}
              onClick={() => goToSection("support")}
            >
              Support
            </button>
          </>
        ) : (
          <>
            <Link
              href={buildPortalUrl(role, bookingParams)}
              className={currentItem === "home" ? "portal-nav-link is-active" : "portal-nav-link"}
            >
              Home
            </Link>

            <Link
              href={branchesHref}
              className={currentItem === "branches" ? "portal-nav-link is-active" : "portal-nav-link"}
            >
              Branches
            </Link>

            <Link
              href={`/portal/bookings?role=${role}`}
              className={currentItem === "bookings" ? "portal-nav-link is-active" : "portal-nav-link"}
            >
              Appointments
            </Link>

            <button
              type="button"
              className={currentItem === "support" ? "portal-nav-link is-active" : "portal-nav-link"}
              onClick={() => goToSection("support")}
            >
              Support
            </button>
          </>
        )}
      </nav>

      <div className="portal-actions">
        <Link href="/" className="portal-login-link">
          Switch User
        </Link>
        <span className="portal-profile" aria-label="Profile">
          {getPortalProfileLabel(role)}
        </span>
      </div>
    </header>
  );
}
