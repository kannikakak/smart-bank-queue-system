"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type BookingConfirmButtonProps = {
  href: string;
  isConfirmed: boolean;
};

export function BookingConfirmButton({ href, isConfirmed }: BookingConfirmButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const title = isConfirmed ? "Already booked" : "Booking successful";
  const description = isConfirmed
    ? "This appointment is already confirmed. You can review it in My Bookings."
    : "Your appointment has been reserved successfully. You can now view it in My Bookings.";

  return (
    <>
      <button
        type="button"
        className="portal-primary-button booking-confirm-button"
        onClick={() => setIsOpen(true)}
      >
        {isConfirmed ? "View My Bookings" : "Book Appointment"}
      </button>

      {isOpen ? (
        <div className="booking-modal-backdrop" role="presentation" onClick={() => setIsOpen(false)}>
          <div
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="booking-modal-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 2.5A9.5 9.5 0 1 0 21.5 12 9.51 9.51 0 0 0 12 2.5Zm4.18 7.64-5.03 5.67a1 1 0 0 1-1.45.07L7.83 14a1 1 0 1 1 1.34-1.48l1.12 1.01 4.39-4.95a1 1 0 1 1 1.5 1.31Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 id="booking-modal-title">{title}</h3>
            <p>{description}</p>

            <div className="booking-modal-actions">
              <button type="button" className="portal-secondary-button" onClick={() => setIsOpen(false)}>
                Close
              </button>
              <button type="button" className="portal-primary-button" onClick={() => router.push(href)}>
                Go to My Bookings
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
