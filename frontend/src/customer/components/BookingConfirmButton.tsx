"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCustomerAppointment } from "@/shared/lib/api";

type BookingConfirmButtonProps = {
  branchId: number;
  serviceId: number;
  startTime: string;
};

export function BookingConfirmButton({
  branchId,
  serviceId,
  startTime,
}: BookingConfirmButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleBooking() {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const appointment = await createCustomerAppointment({
        branchId,
        serviceId,
        startTime,
      });

      router.push(
        `/portal/bookings?role=customer&appointmentId=${appointment.id}&confirmed=1`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "Unable to create appointment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="booking-confirm-actions">
      {errorMessage ? (
        <p className="auth-error-message" aria-live="polite">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="button"
        className="portal-primary-button booking-confirm-button"
        onClick={handleBooking}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Booking..." : "Book Appointment"}
      </button>
    </div>
  );
}
