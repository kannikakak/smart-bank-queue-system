"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { buildBookingsUrl, buildBranchesUrl, buildPortalUrl } from "@/shared/portal/booking-data";
import { usePortalBookingParams } from "@/shared/hooks/usePortalBookingParams";
import type { PortalRole } from "@/shared/portal/portal-role";

const sectionMap = {
  home: "home",
  services: "services",
  bookings: "bookings",
  support: "support",
} as const;

type PortalNavItem = "home" | "branches" | "services" | "bookings" | "support";

type UsePortalNavigationOptions = {
  role: PortalRole;
  activeItem: PortalNavItem;
};

export function usePortalNavigation({ role, activeItem }: UsePortalNavigationOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const bookingParams = usePortalBookingParams();
  const [currentItem, setCurrentItem] = useState<PortalNavItem>(activeItem);
  const searchKey = searchParams.toString();

  useEffect(() => {
    if (pathname === "/portal/bookings" && role === "customer") {
      setCurrentItem("bookings");
      return;
    }

    if (pathname === "/portal/branches" && role === "customer") {
      const hash = window.location.hash.replace("#", "");

      if (hash === "service-selection" || hash === "schedule-selection") {
        setCurrentItem("services");
      } else if (hash === "booking-summary" || searchParams.get("confirmed") === "1") {
        setCurrentItem("bookings");
      } else {
        setCurrentItem("branches");
      }
      return;
    }

    if (pathname !== "/portal") {
      setCurrentItem(activeItem);
      return;
    }

    const hash = window.location.hash.replace("#", "");

    if (hash === "services") {
      setCurrentItem("services");
    } else if (hash === "bookings") {
      setCurrentItem("bookings");
    } else if (hash === "support") {
      setCurrentItem("support");
    } else {
      setCurrentItem("home");
    }
  }, [activeItem, pathname, role, searchKey, searchParams]);

  function goToSection(section: keyof typeof sectionMap) {
    const query = `?role=${role}`;

    if (role === "customer") {
      if (section === "home") {
        router.push(buildPortalUrl(role, bookingParams));
        setCurrentItem("home");
        return;
      }

      if (section === "services") {
        router.push(buildBranchesUrl(role, bookingParams, "service-selection"));
        setCurrentItem("services");
        return;
      }

      if (section === "bookings") {
        router.push(buildBookingsUrl(role, bookingParams));
        setCurrentItem("bookings");
        return;
      }

      if (section === "support") {
        router.push(buildPortalUrl(role, bookingParams, "support"));
        setCurrentItem("support");
        return;
      }
    }

    const targetId = sectionMap[section];
    setCurrentItem(section);

    if (pathname === "/portal") {
      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `/portal${query}#${targetId}`);
        return;
      }
    }

    router.push(`/portal${query}#${targetId}`);
  }

  return {
    bookingParams,
    currentItem,
    goToSection,
  };
}
