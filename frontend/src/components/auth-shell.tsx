"use client";

import Link from "next/link";
import type { FormEvent, ReactNode } from "react";

type AuthField = {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  icon: ReactNode;
};

type AuthShellStatus = {
  tone: "error" | "success" | "info";
  message: string;
};

type AuthShellProps = {
  mode: "login" | "register";
  description: string;
  fields: AuthField[];
  submitLabel: string;
  helperText?: ReactNode;
  footerText: string;
  footerActionLabel: string;
  footerActionHref: string;
  values?: Partial<Record<string, string>>;
  onFieldChange?: (name: string, value: string) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  status?: AuthShellStatus | null;
  submitDisabled?: boolean;
  submitType?: "button" | "submit";
  loginAudience?: "customer" | "workspace";
  onLoginAudienceChange?: (audience: "customer" | "workspace") => void;
};

function BrandMark() {
  return (
    <div className="auth-brand">
      <div className="auth-brand-icon" aria-hidden="true">
        <BankIcon />
      </div>
      <div className="auth-brand-copy">
        <strong>SmartQ</strong>
      </div>
    </div>
  );
}

function FieldIcon({ children }: { children: ReactNode }) {
  return <span className="auth-input-icon">{children}</span>;
}

function fieldAutoComplete(label: string, type: string) {
  if (label === "Email Address") {
    return "email";
  }

  if (label === "Full Name") {
    return "name";
  }

  if (label === "Phone Number") {
    return "tel";
  }

  if (label === "Password") {
    return type === "password" ? "current-password" : "off";
  }

  if (label === "Confirm Password") {
    return "new-password";
  }

  return "off";
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8Z" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16v12H4z" />
      <path d="m5 7 7 6 7-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6.7 3.6h3.1l1.2 5-2.2 1.8a18 18 0 0 0 5.8 5.8l1.8-2.2 5 1.2v3.1c0 1-.8 1.8-1.8 1.8C10.5 20 4 13.5 4 5.4c0-1 .8-1.8 1.8-1.8Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 5 6v6c0 4.4 2.9 8.4 7 9 4.1-.6 7-4.6 7-9V6l-7-3Z" />
    </svg>
  );
}

function CheckShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 5 6v6c0 4.4 2.9 8.4 7 9 4.1-.6 7-4.6 7-9V6l-7-3Z" />
      <path d="m9.2 12.2 1.8 1.8 3.8-4.1" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 9h18" />
      <path d="M5 9v8" />
      <path d="M10 9v8" />
      <path d="M14 9v8" />
      <path d="M19 9v8" />
      <path d="M2 20h20" />
      <path d="m12 3 9 4v2H3V7l9-4Z" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.4a2.6 2.6 0 1 1 4.5 1.9c-.7.7-1.5 1.1-1.8 2" />
      <circle cx="12" cy="16.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3.5-6 10-6s10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function TrustBar() {
  return (
    <div className="auth-trust-bar" aria-label="Security indicators">
      <div className="auth-trust-item">
        <ShieldIcon />
        <span>Secure SSL</span>
      </div>
      <div className="auth-trust-item">
        <LockIcon />
        <span>Private</span>
      </div>
      <div className="auth-trust-item">
        <CheckShieldIcon />
        <span>Verified</span>
      </div>
    </div>
  );
}

export function AuthShell({
  mode,
  description,
  fields,
  submitLabel,
  helperText,
  footerText,
  footerActionLabel,
  footerActionHref,
  values,
  onFieldChange,
  onSubmit,
  status,
  submitDisabled = false,
  submitType = "button",
  loginAudience = "customer",
  onLoginAudienceChange,
}: AuthShellProps) {
  const heading = mode === "register" ? "Create Account" : "Login";
  const switchPrompt = mode === "register" ? "Already have an account?" : "Need a new account?";
  const switchLabel = mode === "register" ? "Login" : "Register";
  const switchHref = mode === "register" ? "/login" : "/register";
  const isLogin = mode === "login";

  return (
    <main className="auth-page">
      <header className="auth-topbar">
        <div className="auth-topbar-inner">
          <BrandMark />
          {isLogin ? (
            <div className="auth-topbar-tools">
              <button className="auth-support-link" suppressHydrationWarning type="button">
                <QuestionIcon />
                <span>Support</span>
              </button>
              <button aria-label="Language" className="auth-globe-button" suppressHydrationWarning type="button">
                <GlobeIcon />
              </button>
            </div>
          ) : (
            <div className="auth-topbar-links">
              <span>{switchPrompt}</span>
              <Link href={switchHref}>{switchLabel}</Link>
            </div>
          )}
        </div>
      </header>

      <section className={isLogin ? "auth-layout auth-layout-login" : "auth-layout"}>
        {isLogin ? (
          <div className="auth-login-shell">
            <div className="auth-promo-panel">
              <div className="auth-promo-copy">
                <h1>
                  The future of <span>secure</span> banking.
                </h1>
                <p>
                  Experience seamless financial management with our next-generation queueing and
                  banking interface.
                </p>
              </div>

              <div className="auth-promo-feature">
                <div className="auth-promo-feature-icon">
                  <CheckShieldIcon />
                </div>
                <div>
                  <strong>Multi-Factor Security</strong>
                  <span>Your data is encrypted with military-grade protocols.</span>
                </div>
              </div>
            </div>

            <div className="auth-login-card">
              <div className="auth-card-head auth-card-head-login">
                <h1>Welcome Back</h1>
                <p>Please enter your details to access your account</p>
              </div>

              <div className="auth-role-switch" aria-label="Login type">
                <button
                  className={loginAudience === "customer" ? "auth-role-option active" : "auth-role-option"}
                  onClick={() => onLoginAudienceChange?.("customer")}
                  suppressHydrationWarning
                  type="button"
                >
                  Customer Login
                </button>
                <button
                  className={loginAudience === "workspace" ? "auth-role-option active" : "auth-role-option"}
                  onClick={() => onLoginAudienceChange?.("workspace")}
                  suppressHydrationWarning
                  type="button"
                >
                  Admin / Staff
                </button>
              </div>

              <form className="auth-form auth-form-login" onSubmit={onSubmit}>
                <div className="auth-field-stack">
                  {fields.map((field) => (
                    <label className="auth-field" key={field.name}>
                      <span className={field.label === "Password" ? "auth-field-row" : undefined}>
                        <span>{field.label === "Email Address" ? "Email or Username" : field.label}</span>
                        {field.label === "Password" ? (
                          <a className="auth-inline-link" href="#">
                            Forgot Password?
                          </a>
                        ) : null}
                      </span>
                      <div className="auth-input-shell auth-input-shell-login">
                        <FieldIcon>{field.icon}</FieldIcon>
                        <input
                          autoComplete={fieldAutoComplete(field.label, field.type)}
                          name={field.name}
                          onChange={
                            onFieldChange
                              ? (event) => onFieldChange(field.name, event.target.value)
                              : undefined
                          }
                          placeholder={field.label === "Email Address" ? "e.g. alex@smartq.com" : field.placeholder}
                          suppressHydrationWarning
                          type={field.type}
                          value={values?.[field.name] ?? ""}
                        />
                        {field.label === "Password" ? (
                          <span className="auth-password-toggle" aria-hidden="true">
                            <EyeIcon />
                          </span>
                        ) : null}
                      </div>
                    </label>
                  ))}
                </div>

                <label className="auth-remember">
                  <input suppressHydrationWarning type="checkbox" />
                  <span>Remember this device for 30 days</span>
                </label>

                {status ? <div className={`auth-status auth-status-${status.tone}`}>{status.message}</div> : null}
                {helperText ? <div className="auth-helper auth-helper-login">{helperText}</div> : null}

                <button className="auth-submit auth-submit-login" disabled={submitDisabled} suppressHydrationWarning type={submitType}>
                  <span>{submitLabel}</span>
                  <ArrowIcon />
                </button>
              </form>

              <div className="auth-footer auth-footer-login">
                <span>{footerText}</span>
                <Link href={footerActionHref}>{footerActionLabel}</Link>
              </div>
            </div>

            <div className="auth-legal">
              <div className="auth-legal-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Settings</a>
              </div>
              <p className="auth-copyright">Copyright 2024 SmartQ Banking Systems Inc. All rights reserved.</p>
            </div>
          </div>
        ) : (
          <div className="auth-card-wrap">
            <div className="auth-card">
              <div className="auth-card-head">
                <h1>{heading}</h1>
                <p>{description}</p>
              </div>

              <form className="auth-form" onSubmit={onSubmit}>
                <div className="auth-field-grid">
                  {fields.map((field) => (
                    <label
                      className={
                        field.label === "Password" || field.label === "Confirm Password"
                          ? "auth-field auth-field-half"
                          : "auth-field"
                      }
                      key={field.name}
                    >
                      <span>{field.label}</span>
                      <div className="auth-input-shell">
                        <FieldIcon>{field.icon}</FieldIcon>
                        <input
                          autoComplete={fieldAutoComplete(field.label, field.type)}
                          name={field.name}
                          onChange={
                            onFieldChange
                              ? (event) => onFieldChange(field.name, event.target.value)
                              : undefined
                          }
                          placeholder={field.placeholder}
                          suppressHydrationWarning
                          type={field.type}
                          value={values?.[field.name] ?? ""}
                        />
                      </div>
                    </label>
                  ))}
                </div>

                {status ? <div className={`auth-status auth-status-${status.tone}`}>{status.message}</div> : null}
                {helperText ? <div className="auth-helper">{helperText}</div> : null}

                <button className="auth-submit" disabled={submitDisabled} suppressHydrationWarning type={submitType}>
                  <span>{submitLabel}</span>
                  <ArrowIcon />
                </button>
              </form>

              <div className="auth-footer">
                <span>{footerText}</span>
                <Link href={footerActionHref}>{footerActionLabel}</Link>
              </div>
            </div>

            <TrustBar />
            <p className="auth-copyright">Copyright 2024 SmartQ Technologies. All rights reserved.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export const authIcons = {
  user: <UserIcon />,
  mail: <MailIcon />,
  phone: <PhoneIcon />,
  lock: <LockIcon />,
  verify: <CheckShieldIcon />,
};
