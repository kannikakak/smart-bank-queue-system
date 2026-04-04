"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { readStoredRole } from "@/shared/lib/api";

type AdminRouteGuardProps = {
  children: ReactNode;
};

function getRedirectTarget(role: string | null) {
  if (role === "staff") {
    return "/portal?role=staff";
  }

  if (role === "admin") {
    return null;
  }

  return "/portal?role=customer";
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const storedRole = readStoredRole();
    const redirectTarget = getRedirectTarget(storedRole);

    if (!redirectTarget) {
      setIsAuthorized(true);
      return;
    }

    router.replace(redirectTarget);
  }, [router]);

  if (!isAuthorized) {
    return (
      <main className="admin-route-guard">
        <div className="admin-route-guard-card">
          <strong>Checking your workspace access...</strong>
          <p>Redirecting you to the correct portal for this account.</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
