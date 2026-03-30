"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MetricCard } from "@/shared/components/MetricCard";
import { RoleCard } from "@/shared/components/RoleCard";
import { TopNav } from "@/shared/components/TopNav";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Zm1.7.13 5.76 4.8a.85.85 0 0 0 1.08 0l5.76-4.8a1 1 0 0 0-.8-.38h-11a1 1 0 0 0-.8.38Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8 10V8a4 4 0 1 1 8 0v2h.5A2.5 2.5 0 0 1 19 12.5v7a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 19.5v-7A2.5 2.5 0 0 1 7.5 10H8Zm2 0h4V8a2 2 0 1 0-4 0v2Zm2 4.25a1.5 1.5 0 0 0-.75 2.8v1.45h1.5V17.05a1.5 1.5 0 0 0-.75-2.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 5c5.35 0 9.3 4.44 10.46 5.9a1.74 1.74 0 0 1 0 2.2C21.3 14.56 17.35 19 12 19s-9.3-4.44-10.46-5.9a1.74 1.74 0 0 1 0-2.2C2.7 9.44 6.65 5 12 5Zm0 2C8.1 7 4.99 10.05 3.58 12 4.99 13.95 8.1 17 12 17s7.01-3.05 8.42-5C19.01 10.05 15.9 7 12 7Zm0 2.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12.3 5.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 1 1-1.4-1.4l4.3-4.3H5a1 1 0 1 1 0-2h11.6l-4.3-4.3a1 1 0 0 1 0-1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

const roleContent = {
  customer: {
    introTitle: "Customer portal access",
    introText: "Use the access form below to continue to the booking and queue experience.",
    fieldLabel: "Email or Username",
    fieldPlaceholder: "e.g. alex@smartq.com",
    forgotText: "Need help signing in?",
    rememberText: "Remember this device for 30 days",
    buttonText: "Continue as Customer",
    supportNote: "Need account assistance?",
    supportAction: "Contact support",
    spotlightLabel: "Customer service overview",
    spotlightText:
      "Monitor queue activity and customer flow across branch locations in real time.",
  },
  admin: {
    introTitle: "Admin workspace access",
    introText: "Use the staff access form below to open the operations control workspace.",
    fieldLabel: "Staff ID or Email",
    fieldPlaceholder: "e.g. branch.manager@smartq.com",
    forgotText: "Need access help?",
    rememberText: "Keep this workstation signed in",
    buttonText: "Continue as Admin",
    supportNote: "Need access approval?",
    supportAction: "Contact IT support",
    spotlightLabel: "Branch operations overview",
    spotlightText:
      "Track service desk availability, staff activity, and queue coordination across branches.",
  },
  staff: {
    introTitle: "Staff workspace access",
    introText: "Use the branch access form below to continue to the staff service workspace.",
    fieldLabel: "Staff ID or Email",
    fieldPlaceholder: "e.g. teller01@smartq.com",
    forgotText: "Need help signing in?",
    rememberText: "Keep this branch device signed in",
    buttonText: "Continue as Staff",
    supportNote: "Need branch support?",
    supportAction: "Contact operations",
    spotlightLabel: "Staff service view",
    spotlightText:
      "Stay on top of customer appointments, service desks, and branch support activity.",
  },
} as const;

export default function HomePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] =
    useState<keyof typeof roleContent>("customer");
  const [isPending, startTransition] = useTransition();
  const content = roleContent[selectedRole];
  const supportHref =
    selectedRole === "admin"
      ? "/portal?role=admin&section=help"
      : selectedRole === "staff"
        ? "/portal?role=staff#support"
        : "/portal?role=customer#support";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(() => {
      router.push(`/portal?role=${selectedRole}`);
    });
  }

  return (
    <main className="banking-page">
      <TopNav />

      <section className="auth-shell">
        <div className="showcase-panel">
          <div className="showcase-copy">
            <p className="showcase-kicker">Digital banking operations portal</p>
            <h1>
              Secure access for branch and customer services.
            </h1>
            <p className="showcase-text">
              Manage branch queues, customer access, and service operations from
              one reliable banking platform.
            </p>

            <div className="showcase-points" aria-label="Platform highlights">
              <span>Queue visibility</span>
              <span>Role-based access</span>
              <span>Branch coordination</span>
            </div>
          </div>

          <div className="showcase-lower">
            <div className="showcase-spotlight">
              <p className="spotlight-label">{content.spotlightLabel}</p>
              <strong>24 active service desks</strong>
              <span>{content.spotlightText}</span>
            </div>

            <MetricCard
              title="Multi-Factor Security"
              description="Protect staff and customer accounts with controlled access and secure authentication."
            />
          </div>
        </div>

        <div className="login-panel">
          <div className="login-intro">
            <h2>{content.introTitle}</h2>
            <p>{content.introText}</p>
          </div>

          <div className="auth-card">
            <div className="role-grid" aria-label="Login roles">
              <RoleCard
                title="Customer"
                active={selectedRole === "customer"}
                onClick={() => setSelectedRole("customer")}
              />
              <RoleCard
                title="Admin"
                active={selectedRole === "admin"}
                onClick={() => setSelectedRole("admin")}
              />
              <RoleCard
                title="Staff"
                active={selectedRole === "staff"}
                onClick={() => setSelectedRole("staff")}
              />
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="field-label" htmlFor="email">
                {content.fieldLabel}
              </label>
              <div className="field-shell">
                <span className="field-icon">
                  <MailIcon />
                </span>
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder={content.fieldPlaceholder}
                  autoComplete="username"
                  spellCheck={false}
                  suppressHydrationWarning
                />
              </div>

              <div className="field-row">
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <Link href={supportHref} className="text-link">
                  {content.forgotText}
                </Link>
              </div>

              <div className="field-shell">
                <span className="field-icon">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="........"
                  autoComplete="current-password"
                  suppressHydrationWarning
                />
                <button
                  className="icon-button"
                  type="button"
                  aria-label="Show password"
                  suppressHydrationWarning
                >
                  <EyeIcon />
                </button>
              </div>

              <label className="checkbox-row">
                <input type="checkbox" name="rememberDevice" suppressHydrationWarning />
                <span>{content.rememberText}</span>
              </label>

              <button
                className="sign-in-button"
                type="submit"
                disabled={isPending}
                suppressHydrationWarning
              >
                <span>{isPending ? "Signing In..." : content.buttonText}</span>
                <ArrowIcon />
              </button>
            </form>

            <div className="login-divider" />

            <p className="signup-note">
              {content.supportNote} <Link href={supportHref}>{content.supportAction}</Link>
            </p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <nav className="footer-links" aria-label="Footer">
          <Link href="/portal?role=customer">Portal Home</Link>
          <Link href="/portal/branches?role=customer#branch-selection">Booking Flow</Link>
          <Link href="/portal?role=customer#support">Support</Link>
        </nav>
        <p>Copyright 2024 SmartQ Banking Systems Inc. All rights reserved.</p>
      </footer>
    </main>
  );
}
