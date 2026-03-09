"use client";

import type { FormEvent, ReactNode } from "react";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, authIcons } from "@/components/auth-shell";
import { login } from "@/lib/api";
import { saveSession } from "@/lib/auth-session";

type LoginFormState = {
  email: string;
  password: string;
};

type LoginAudience = "customer" | "workspace";

const seededAccounts: Record<
  LoginAudience,
  { email: string; password: string; helper: ReactNode }
> = {
  customer: {
    email: "customer@smartq.local",
    password: "Customer@123",
    helper: (
      <span>
        Try <strong>customer@smartq.local</strong> / <strong>Customer@123</strong>.
      </span>
    ),
  },
  workspace: {
    email: "admin@smartq.local",
    password: "Admin@123",
    helper: (
      <span>
        Try <strong>admin@smartq.local</strong> / <strong>Admin@123</strong> or{" "}
        <strong>staff@smartq.local</strong> / <strong>Staff@123</strong>.
      </span>
    ),
  },
};

function routeForRole(role: "CUSTOMER" | "STAFF" | "ADMIN") {
  if (role === "ADMIN") {
    return "/admin";
  }

  if (role === "STAFF") {
    return "/staff";
  }

  return "/customer";
}

export default function LoginPage() {
  const router = useRouter();
  const [loginAudience, setLoginAudience] = useState<LoginAudience>("customer");
  const [form, setForm] = useState<LoginFormState>({
    email: seededAccounts.customer.email,
    password: seededAccounts.customer.password,
  });
  const [status, setStatus] = useState<{ tone: "error" | "success" | "info"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleAudienceChange(audience: LoginAudience) {
    setLoginAudience(audience);
    setStatus(null);
    setForm({
      email: seededAccounts[audience].email,
      password: seededAccounts[audience].password,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setStatus({
        tone: "error",
        message: "Enter both email and password before signing in.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({
      tone: "info",
      message: "Signing in to SmartQ...",
    });

    try {
      const response = await login({
        email: form.email.trim(),
        password: form.password,
      });

      saveSession({
        accessToken: response.accessToken,
        role: response.role,
        displayName: response.displayName,
        email: form.email.trim(),
      });

      setStatus({
        tone: "success",
        message: `Signed in as ${response.displayName}. Redirecting...`,
      });

      startTransition(() => {
        router.replace(routeForRole(response.role));
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setStatus({
        tone: "error",
        message,
      });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  }

  return (
    <AuthShell
      mode="login"
      description="Please enter your details to access your account."
      fields={[
        {
          name: "email",
          label: "Email Address",
          type: "email",
          placeholder: "customer@smartq.local",
          icon: authIcons.mail,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
          icon: authIcons.lock,
        },
      ]}
      footerActionHref="/register"
      footerActionLabel="Open an account"
      footerText="Don&apos;t have a SmartQ account?"
      helperText={seededAccounts[loginAudience].helper}
      loginAudience={loginAudience}
      onFieldChange={(name, value) => {
        setForm((current) => ({
          ...current,
          [name]: value,
        }));
      }}
      onLoginAudienceChange={handleAudienceChange}
      onSubmit={handleSubmit}
      status={status}
      submitDisabled={isSubmitting}
      submitLabel={isSubmitting ? "Signing In..." : "Sign In to SmartQ"}
      submitType="submit"
      values={form}
    />
  );
}
