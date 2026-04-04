"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { login, register } from "@/shared/lib/api";

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3 3 7v2h18V7l-9-4Zm-6 8h2v6H6v-6Zm5 0h2v6h-2v-6Zm5 0h2v6h-2v-6ZM3 19h18v2H3v-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

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

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 12a4.25 4.25 0 1 0-4.25-4.25A4.25 4.25 0 0 0 12 12Zm0 2c-4 0-7.25 2.52-7.25 5.63 0 .2.17.37.37.37h13.76c.2 0 .37-.17.37-.37C19.25 16.52 16 14 12 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

type AuthMode = "signin" | "register";

const authStorageKeys = [
  "smartq.accessToken",
  "smartq.role",
  "smartq.roleLabel",
  "smartq.permissions",
  "smartq.displayName",
] as const;

function mapApiRoleToPortalRole(role: "CUSTOMER" | "STAFF" | "ADMIN") {
  if (role === "ADMIN") {
    return "admin";
  }

  if (role === "STAFF") {
    return "staff";
  }

  return "customer";
}

export default function HomePage() {
  const router = useRouter();
  const [isClientReady, setIsClientReady] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  function clearStoredAuth() {
    authStorageKeys.forEach((key) => {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    });
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(false);
  }

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    try {
      const auth = await login({
        email: email.trim(),
        password,
      });
      const resolvedRole = mapApiRoleToPortalRole(auth.role);
      const storage = rememberDevice ? window.localStorage : window.sessionStorage;

      clearStoredAuth();
      storage.setItem("smartq.accessToken", auth.accessToken);
      storage.setItem("smartq.role", resolvedRole);
      storage.setItem("smartq.roleLabel", auth.roleLabel);
      storage.setItem("smartq.permissions", JSON.stringify(auth.permissions));
      storage.setItem("smartq.displayName", auth.displayName);

      router.push(`/portal?role=${resolvedRole}`);
    } catch (error) {
      const message =
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : "Unable to sign in. Check the backend server and your credentials.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (registerPassword !== registerConfirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const auth = await register({
        fullName: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      });
      const resolvedRole = mapApiRoleToPortalRole(auth.role);

      clearStoredAuth();
      window.localStorage.setItem("smartq.accessToken", auth.accessToken);
      window.localStorage.setItem("smartq.role", resolvedRole);
      window.localStorage.setItem("smartq.roleLabel", auth.roleLabel);
      window.localStorage.setItem("smartq.permissions", JSON.stringify(auth.permissions));
      window.localStorage.setItem("smartq.displayName", auth.displayName);

      setInfoMessage("Account created successfully. Redirecting to your portal...");
      router.push(`/portal?role=${resolvedRole}`);
    } catch (error) {
      const message =
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : "Unable to create your account right now.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="banking-page banking-page-auth-compact">
      <section className="auth-compact-shell">
        <Link href="/" className="brand auth-page-brand auth-page-brand-compact" aria-label="SmartQ Home">
          <span className="brand-badge" aria-hidden="true">
            <BankIcon />
          </span>
          <span className="brand-copy">
            <span className="brand-name">SmartQ Bank</span>
            <span className="brand-subtitle">Banking Queue Platform</span>
          </span>
        </Link>

        <div className="auth-card auth-card-simple auth-card-compact">
          {isClientReady ? (
            <>
              <div className="auth-tabs" role="tablist" aria-label="Authentication">
                <button
                  type="button"
                  className={`auth-tab${mode === "signin" ? " is-active" : ""}`}
                  onClick={() => switchMode("signin")}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab${mode === "register" ? " is-active" : ""}`}
                  onClick={() => switchMode("register")}
                >
                  Register
                </button>
              </div>

              <div className="login-intro login-intro-compact">
                <h1>{mode === "signin" ? "Welcome back" : "Create account"}</h1>
                <p>
                  {mode === "signin"
                    ? "Sign in with your account to continue."
                    : "Fill in your details to create a new account."}
                </p>
              </div>

              {mode === "signin" ? (
                <form className="login-form" onSubmit={handleLoginSubmit}>
                  <label className="field-label" htmlFor="email">
                    Email
                  </label>
                  <div className="field-shell">
                    <span className="field-icon">
                      <MailIcon />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email"
                      suppressHydrationWarning
                      required
                    />
                  </div>

                  <label className="field-label" htmlFor="password">
                    Password
                  </label>
                  <div className="field-shell">
                    <span className="field-icon">
                      <LockIcon />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      suppressHydrationWarning
                      required
                    />
                    <button
                      className="icon-button"
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      <EyeIcon />
                    </button>
                  </div>

                  <div className="auth-form-meta auth-form-meta-compact">
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(event) => setRememberDevice(event.target.checked)}
                        suppressHydrationWarning
                      />
                      <span>Remember me</span>
                    </label>
                    <a className="text-link" href="mailto:support@smartqbank.com">
                      Forgot password
                    </a>
                  </div>

                  {errorMessage ? (
                    <p className="auth-error-message" aria-live="polite">
                      {errorMessage}
                    </p>
                  ) : null}

                  {infoMessage ? (
                    <p className="auth-info-message" aria-live="polite">
                      {infoMessage}
                    </p>
                  ) : null}

                  <button
                    className="sign-in-button sign-in-button-simple"
                    type="submit"
                    disabled={isSubmitting}
                    suppressHydrationWarning
                  >
                    <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
                  </button>
                </form>
              ) : (
                <form className="login-form" onSubmit={handleRegisterSubmit}>
                  <label className="field-label" htmlFor="registerName">
                    Full name
                  </label>
                  <div className="field-shell">
                    <span className="field-icon">
                      <UserIcon />
                    </span>
                    <input
                      id="registerName"
                      name="registerName"
                      type="text"
                      autoComplete="name"
                      value={registerName}
                      onChange={(event) => setRegisterName(event.target.value)}
                      placeholder="Enter your full name"
                      suppressHydrationWarning
                      required
                    />
                  </div>

                  <label className="field-label" htmlFor="registerEmail">
                    Email
                  </label>
                  <div className="field-shell">
                    <span className="field-icon">
                      <MailIcon />
                    </span>
                    <input
                      id="registerEmail"
                      name="registerEmail"
                      type="email"
                      autoComplete="email"
                      value={registerEmail}
                      onChange={(event) => setRegisterEmail(event.target.value)}
                      placeholder="Enter your email"
                      suppressHydrationWarning
                      required
                    />
                  </div>

                  <label className="field-label" htmlFor="registerPassword">
                    Password
                  </label>
                  <div className="field-shell">
                    <span className="field-icon">
                      <LockIcon />
                    </span>
                    <input
                      id="registerPassword"
                      name="registerPassword"
                      type="password"
                      autoComplete="new-password"
                      value={registerPassword}
                      onChange={(event) => setRegisterPassword(event.target.value)}
                      placeholder="Create a password"
                      suppressHydrationWarning
                      required
                    />
                  </div>

                  <label className="field-label" htmlFor="registerConfirmPassword">
                    Confirm password
                  </label>
                  <div className="field-shell">
                    <span className="field-icon">
                      <LockIcon />
                    </span>
                    <input
                      id="registerConfirmPassword"
                      name="registerConfirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={registerConfirmPassword}
                      onChange={(event) => setRegisterConfirmPassword(event.target.value)}
                      placeholder="Confirm your password"
                      suppressHydrationWarning
                      required
                    />
                  </div>

                  {errorMessage ? (
                    <p className="auth-error-message" aria-live="polite">
                      {errorMessage}
                    </p>
                  ) : null}

                  {infoMessage ? (
                    <p className="auth-info-message" aria-live="polite">
                      {infoMessage}
                    </p>
                  ) : null}

                  <button
                    className="sign-in-button sign-in-button-simple"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? "Creating..." : "Create account"}</span>
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <div className="auth-tabs" aria-label="Authentication">
                <span className="auth-tab is-active">Sign In</span>
                <span className="auth-tab">Register</span>
              </div>

              <div className="login-intro login-intro-compact">
                <h1>Welcome back</h1>
                <p>Sign in with your account to continue.</p>
              </div>

              <div className="login-form" aria-hidden="true">
                <label className="field-label">Email</label>
                <div className="field-shell">
                  <span className="field-icon">
                    <MailIcon />
                  </span>
                  <input type="email" placeholder="Enter your email" disabled />
                </div>

                <label className="field-label">Password</label>
                <div className="field-shell">
                  <span className="field-icon">
                    <LockIcon />
                  </span>
                  <input type="password" placeholder="Enter your password" disabled />
                </div>

                <div className="auth-form-meta auth-form-meta-compact">
                  <span className="checkbox-row">
                    <input type="checkbox" disabled />
                    <span>Remember me</span>
                  </span>
                  <span className="text-link">Forgot password</span>
                </div>

                <button className="sign-in-button sign-in-button-simple" type="button" disabled>
                  <span>Loading...</span>
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <footer className="site-footer">
        <p>Copyright 2024 SmartQ Banking Systems Inc. All rights reserved.</p>
      </footer>
    </main>
  );
}
