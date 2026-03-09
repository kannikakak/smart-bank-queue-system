"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerCta } from "./customer-cta";
import { CustomerFooter } from "./customer-footer";
import { CustomerHero } from "./customer-hero";
import { CustomerNav } from "./customer-nav";
import { CustomerProcess } from "./customer-process";
import { CustomerServiceShowcase } from "./customer-service-showcase";
import { readSession, type SmartQSession } from "@/lib/auth-session";
import {
  filterCustomerServices,
  type ServiceCategoryId,
} from "../data/homepage";

export function CustomerDashboardView() {
  const router = useRouter();
  const [session, setSession] = useState<SmartQSession | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const resultCount = filterCustomerServices(activeCategory, searchQuery).length;

  useEffect(() => {
    const storedSession = readSession();

    if (!storedSession || storedSession.role !== "CUSTOMER") {
      router.replace("/login");
      return;
    }

    setSession(storedSession);
    setIsLoadingSession(false);
  }, [router]);

  if (isLoadingSession) {
    return (
      <main className="customer-home customer-home-loading">
        <div className="customer-session-card">
          <strong>Loading your SmartQ account...</strong>
          <span>Checking your customer session before opening booking.</span>
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="customer-home">
      <CustomerNav
        searchQuery={searchQuery}
        session={session}
        onSearchChange={setSearchQuery}
      />
      <div className="customer-page-shell">
        <CustomerHero displayName={session.displayName} />
        <CustomerProcess
          activeCategory={activeCategory}
          resultCount={resultCount}
          onCategoryChange={setActiveCategory}
        />
        <CustomerServiceShowcase
          activeCategory={activeCategory}
          searchQuery={searchQuery}
        />
        <CustomerCta />
      </div>
      <CustomerFooter />
    </main>
  );
}
