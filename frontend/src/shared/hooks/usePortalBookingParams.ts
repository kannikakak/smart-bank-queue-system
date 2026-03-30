"use client";

import { useSearchParams } from "next/navigation";
import { parseBookingParams } from "@/shared/portal/booking-query";

export function usePortalBookingParams() {
  const searchParams = useSearchParams();
  return parseBookingParams(searchParams);
}
