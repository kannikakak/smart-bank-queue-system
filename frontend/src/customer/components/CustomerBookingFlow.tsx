"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookingConfirmButton } from "@/customer/components/BookingConfirmButton";
import { BookingFlowSelect } from "@/customer/components/BookingFlowSelect";
import {
  getBranches,
  getCustomerAvailability,
  getServices,
  type AvailableSlotSummary,
  type BranchSummary,
  type ServiceSummary,
} from "@/shared/lib/api";
import {
  buildBranchesUrl,
  formatTimeLabel,
  getBookingSelectionWithData,
  getBranchMapUrl,
  getHoursRange,
  type BookingBranch,
  type BookingParams,
  type BookingService,
} from "@/shared/portal/booking-data";
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  LocationIcon,
  QueueIcon,
  ServiceIcon,
} from "@/shared/components/portal/PortalIcons";

type CustomerBookingFlowProps = {
  params: BookingParams;
};

function mapBranchToBookingBranch(branch: BranchSummary): BookingBranch {
  const advisorCount = Math.max(branch.activeCounters, 1);

  return {
    id: String(branch.id),
    name: branch.name,
    address: branch.address,
    hours: branch.openingHours,
    appointmentSupport: `${advisorCount} advisor${advisorCount === 1 ? "" : "s"} coordinating appointments`,
    note: "Live branch readiness loaded from the SmartQ appointment system.",
  };
}

function mapServiceToBookingService(service: ServiceSummary): BookingService {
  return {
    id: String(service.id),
    title: service.name,
    duration: `${service.durationMinutes} min`,
    availability: service.appointmentRequired ? "Appointment required" : "Walk-in supported",
    description: `${service.name} is currently available in the SmartQ service catalog.`,
  };
}

function toIsoStartTime(date: string, time: string) {
  return `${date}T${time}:00`;
}

function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function formatScheduleWeekday(value: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(parseIsoDate(value));
}

function formatScheduleMonthDay(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parseIsoDate(value));
}

export function CustomerBookingFlow({ params }: CustomerBookingFlowProps) {
  const role = "customer";
  const [branches, setBranches] = useState<BookingBranch[]>([]);
  const [services, setServices] = useState<BookingService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [branchResponse, serviceResponse] = await Promise.all([
          getBranches(),
          getServices(),
        ]);

        if (!isMounted) {
          return;
        }

        setBranches(branchResponse.map(mapBranchToBookingBranch));
        setServices(serviceResponse.map(mapServiceToBookingService));
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error && error.message
            ? error.message
            : "Unable to load booking data.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const {
    dateOptions,
    selectedBranch,
    selectedService,
    selectedDate,
  } = useMemo(
    () => getBookingSelectionWithData(params, branches, services),
    [branches, params, services],
  );
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotSummary[]>([]);
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
  const timeSlots = useMemo(
    () => availableSlots.map((slot) => slot.startTime.slice(11, 16)),
    [availableSlots],
  );
  const selectedTime = timeSlots.includes(params.time ?? "") ? params.time : undefined;
  const isConfirmed =
    params.confirmed === "1" && Boolean(selectedBranch && selectedService && selectedDate && selectedTime);
  const currentStep = isConfirmed
    ? 4
    : selectedDate && selectedTime
      ? 4
      : selectedService
        ? 3
        : selectedBranch
          ? 2
          : 1;
  const progressPercent = `${Math.min(currentStep * 25, 100)}%`;
  const currentStepLabel =
    currentStep === 1
      ? "Select Branch"
      : currentStep === 2
        ? "Select Service"
        : currentStep === 3
          ? "Pick Date & Time"
        : "Book Appointment";
  const selectedHours = selectedBranch ? getHoursRange(selectedBranch.hours) : null;
  const selectedTimeLabel = selectedTime ? formatTimeLabel(selectedTime) : "Not selected";
  const selectedDateLabel = selectedDate?.longLabel ?? "Not selected";
  const selectionSummary = [
    {
      label: "Branch",
      value: selectedBranch?.name ?? "Choose a branch",
      isComplete: Boolean(selectedBranch),
    },
    {
      label: "Service",
      value: selectedService?.title ?? "Choose a service",
      isComplete: Boolean(selectedService),
    },
    {
      label: "Date",
      value: selectedDate?.label ?? "Choose a date",
      isComplete: Boolean(selectedDate),
    },
    {
      label: "Time",
      value: selectedTime ? formatTimeLabel(selectedTime) : "Choose a time",
      isComplete: Boolean(selectedTime),
    },
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadAvailability() {
      if (!(selectedBranch && selectedService && selectedDate)) {
        setAvailableSlots([]);
        return;
      }

      try {
        setIsAvailabilityLoading(true);
        const slotResponse = await getCustomerAvailability(
          Number(selectedBranch.id),
          Number(selectedService.id),
          selectedDate.value,
        );

        if (!isMounted) {
          return;
        }

        setAvailableSlots(slotResponse);
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setAvailableSlots([]);
        setErrorMessage(
          error instanceof Error && error.message
            ? error.message
            : "Unable to load available time slots.",
        );
      } finally {
        if (isMounted) {
          setIsAvailabilityLoading(false);
        }
      }
    }

    void loadAvailability();

    return () => {
      isMounted = false;
    };
  }, [selectedBranch, selectedService, selectedDate]);

  const stepStates = [
    {
      id: "branch-selection",
      label: "Select Branch",
      state: selectedBranch ? "is-complete" : "is-active",
    },
    {
      id: "service-selection",
      label: "Select Service",
      state: selectedBranch && selectedService ? "is-complete" : selectedBranch ? "is-active" : "",
    },
    {
      id: "schedule-selection",
      label: "Pick Date & Time",
      state:
        selectedBranch && selectedService && selectedDate && selectedTime
          ? "is-complete"
          : selectedBranch && selectedService
            ? "is-active"
            : "",
    },
    {
      id: "booking-summary",
      label: "Book Appointment",
      state:
        isConfirmed
          ? "is-complete"
          : selectedBranch && selectedService && selectedDate && selectedTime
            ? "is-active"
            : "",
    },
  ];

  return (
    <section className="branches-page">
      <div className="branches-hero">
        <p className="branches-kicker">Booking flow</p>
        <h1>Select your branch, service, date, and time</h1>
        <p>
          Live branch and service data is loaded from the backend, then your confirmed booking is
          saved to the appointment system for staff preparation.
        </p>
      </div>

      <div className="booking-progress-card">
        <div className="booking-progress-header">
          <div>
            <p className="branches-kicker">Booking flow</p>
            <h2>{currentStepLabel}</h2>
          </div>
          <div className="booking-progress-meta">
            <strong>Step {currentStep} of 4</strong>
            <span>{progressPercent} complete</span>
          </div>
        </div>
        <div className="booking-progress-track" aria-hidden="true">
          <span style={{ width: progressPercent }} />
        </div>

        <div className="booking-progress-overview">
          {selectionSummary.map((item) => (
            <div
              key={item.label}
              className={`booking-progress-pill ${item.isComplete ? "is-complete" : ""}`.trim()}
            >
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>

      {errorMessage ? (
        <p className="auth-error-message" aria-live="polite">
          {errorMessage}
        </p>
      ) : null}

      <div className="booking-stepper">
        {stepStates.map((step, index) => (
          <a
            key={step.id}
            className={`booking-step-link ${step.state}`.trim()}
            href={`#${step.id}`}
            aria-label={`Step ${index + 1}: ${step.label}`}
          >
            <span className="booking-step-marker" aria-hidden="true">
              {step.state === "is-complete" ? <CheckIcon /> : index + 1}
            </span>
            <span className="booking-step-label">{step.label}</span>
            {index < stepStates.length - 1 ? (
              <span
                className={`booking-step-connector ${step.state === "is-complete" ? "is-complete" : ""}`.trim()}
                aria-hidden="true"
              />
            ) : null}
          </a>
        ))}
      </div>

      <section className="booking-step-section" id="branch-selection">
        <div className="booking-section-header">
          <div>
            <p className="branches-kicker">Step 1</p>
            <h2>Select branch</h2>
          </div>
          <span className="booking-step-status">
            {selectedBranch ? "Branch selected" : isLoading ? "Loading branches" : "Required"}
          </span>
        </div>

        <div className="booking-selector-layout">
          <div className="booking-selector-card">
            <div className="booking-selector-copy">
              <p className="branches-kicker">Live branches</p>
              <h3>Select from backend-managed branches</h3>
              <p>
                Branch names, addresses, hours, and advisor availability now come directly from the
                backend.
              </p>
            </div>

            <BookingFlowSelect
              kind="branch"
              role={role}
              selectedValue={selectedBranch?.id}
              placeholder="Choose branch"
              meta={isLoading ? "Loading..." : `${branches.length} branches`}
              hint="Live branch data from SmartQ"
              hash="service-selection"
              params={params}
              options={branches.map((branch) => ({
                id: branch.id,
                label: branch.name,
              }))}
            />
          </div>

          {selectedBranch ? (
            <article className="booking-spotlight-card">
              <div className="branch-card-header">
                <h3>{selectedBranch.name}</h3>
                <span className="branch-badge">Selected Branch</span>
              </div>

              <div className="booking-spotlight-grid">
                <div className="booking-spotlight-item">
                  <span className="branch-detail-icon" aria-hidden="true">
                    <LocationIcon />
                  </span>
                  <div>
                    <strong>Address</strong>
                    <p>{selectedBranch.address}</p>
                  </div>
                </div>

                <div className="booking-spotlight-item">
                  <span className="branch-detail-icon" aria-hidden="true">
                    <ClockIcon />
                  </span>
                  <div>
                    <strong>Opening Hours</strong>
                    <p>
                      Open {getHoursRange(selectedBranch.hours).open} / Close{" "}
                      {getHoursRange(selectedBranch.hours).close}
                    </p>
                  </div>
                </div>

                <div className="booking-spotlight-item">
                  <span className="branch-detail-icon" aria-hidden="true">
                    <QueueIcon />
                  </span>
                  <div>
                    <strong>Appointment Support</strong>
                    <p>{selectedBranch.appointmentSupport}</p>
                  </div>
                </div>
              </div>

              <p className="branch-card-note">{selectedBranch.note}</p>

              <div className="booking-spotlight-tags">
                <span>Open {selectedHours?.open}</span>
                <span>Close {selectedHours?.close}</span>
                <span>{selectedBranch.appointmentSupport}</span>
              </div>

              <div className="branch-card-actions">
                <a
                  href={getBranchMapUrl(selectedBranch.address)}
                  target="_blank"
                  rel="noreferrer"
                  className="portal-secondary-button"
                >
                  Open Map
                </a>
                <Link
                  href={buildBranchesUrl(role, { branch: selectedBranch.id }, "service-selection")}
                  className="portal-primary-button"
                >
                  Continue to Service
                </Link>
              </div>
            </article>
          ) : (
            <div className="booking-empty-state">
              {isLoading
                ? "Loading branches from the backend..."
                : "Choose a branch from the dropdown to view its address, hours, and appointment support details."}
            </div>
          )}
        </div>
      </section>

      <section className="booking-step-section" id="service-selection">
        <div className="booking-section-header">
          <div>
            <p className="branches-kicker">Step 2</p>
            <h2>Select service</h2>
          </div>
          <span className="booking-step-status">
            {selectedService
              ? "Service selected"
              : selectedBranch
                ? "Choose service"
                : "Select a branch first"}
          </span>
        </div>

        {selectedBranch ? (
          <div className="booking-selector-layout">
            <div className="booking-selector-card">
              <div className="booking-selector-copy">
                <p className="branches-kicker">Live services</p>
                <h3>Select the service for {selectedBranch.name}</h3>
                <p>
                  Service names and durations now come directly from the backend catalog.
                </p>
              </div>

              <BookingFlowSelect
                kind="service"
                role={role}
                selectedValue={selectedService?.id}
                placeholder="Choose service"
                meta={selectedBranch.name}
                hint="Service list from SmartQ catalog"
                hash="schedule-selection"
                params={params}
                options={services.map((service) => ({
                  id: service.id,
                  label: service.title,
                }))}
              />
            </div>

            {selectedService ? (
              <article className="booking-spotlight-card booking-service-card is-selected">
                <div className="booking-service-header">
                  <div className="branch-detail-icon" aria-hidden="true">
                    <ServiceIcon />
                  </div>
                  <div>
                    <h3>{selectedService.title}</h3>
                    <p>{selectedService.description}</p>
                  </div>
                </div>

                <div className="booking-service-meta">
                  <span className="booking-meta-pill">{selectedService.duration}</span>
                  <span className="booking-meta-pill">{selectedService.availability}</span>
                  <span className="booking-meta-pill">{selectedBranch.name}</span>
                </div>

                <div className="branch-card-actions">
                  <Link
                    href={buildBranchesUrl(
                      role,
                      { branch: selectedBranch.id, service: selectedService.id },
                      "schedule-selection",
                    )}
                    className="portal-primary-button"
                  >
                    Continue to Date & Time
                  </Link>
                </div>
              </article>
            ) : (
              <div className="booking-empty-state">
                Choose a service from the dropdown to see its duration and booking rules.
              </div>
            )}
          </div>
        ) : (
          <div className="booking-empty-state">
            Select a branch first to unlock the available banking services.
          </div>
        )}
      </section>

      <section className="booking-step-section" id="schedule-selection">
        <div className="booking-section-header">
          <div>
            <p className="branches-kicker">Step 3</p>
            <h2>Pick date and time</h2>
          </div>
          <span className="booking-step-status">
            {selectedDate && selectedTime
              ? "Schedule selected"
              : selectedService
                ? "Choose schedule"
                : "Select a service first"}
          </span>
        </div>

        {selectedBranch && selectedService ? (
          <div className="booking-schedule-layout">
            <div className="booking-schedule-main">
              <div className="booking-schedule-panel">
                <div className="booking-schedule-panel-head">
                  <div>
                    <h3>Choose a date</h3>
                    <p>Available days for this service at {selectedBranch.name}.</p>
                  </div>
                  <span className="booking-schedule-count">Step 3 of 4</span>
                </div>

                <div className="booking-schedule-context">
                  <span>{selectedBranch.name}</span>
                  <span>{selectedService.title}</span>
                </div>

                <div className="booking-date-grid">
                  {dateOptions.map((date) => {
                    const isSelected = selectedDate?.value === date.value;

                    return (
                      <Link
                        key={date.value}
                        href={buildBranchesUrl(
                          role,
                          {
                            branch: selectedBranch.id,
                            service: selectedService.id,
                            date: date.value,
                          },
                          "schedule-selection",
                        )}
                        className={`booking-date-pill ${isSelected ? "is-selected" : ""}`.trim()}
                      >
                        <span>{formatScheduleWeekday(date.value)}</span>
                        <strong>{date.value.slice(8, 10)}</strong>
                        <small>{isSelected ? "Selected" : "Available"}</small>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="booking-schedule-panel">
                <div className="booking-schedule-panel-head">
                  <div>
                    <h3>Choose a time</h3>
                    <p>Pick a live slot for {selectedDate?.longLabel ?? "your selected date"}.</p>
                  </div>
                  <span className="booking-schedule-count">
                    {selectedDate && !isAvailabilityLoading ? `${timeSlots.length} slots` : "Live"}
                  </span>
                </div>

                <div className="booking-time-head">
                  <span className="booking-time-note">
                    {selectedDate ? selectedDate.longLabel : "Select a date first"}
                  </span>
                  <span className="booking-time-note is-muted">Live branch availability</span>
                </div>

                <div className="booking-time-grid">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTime === slot;

                    if (!selectedDate) {
                      return (
                        <span
                          key={slot}
                          className="booking-time-pill is-disabled"
                          aria-disabled="true"
                        >
                          <strong>{formatTimeLabel(slot)}</strong>
                          <small>Locked</small>
                        </span>
                      );
                    }

                    return (
                      <Link
                        key={slot}
                        href={buildBranchesUrl(
                          role,
                          {
                            branch: selectedBranch.id,
                            service: selectedService.id,
                            date: selectedDate.value,
                            time: slot,
                          },
                          "booking-summary",
                        )}
                        className={`booking-time-pill ${isSelected ? "is-selected" : ""}`.trim()}
                      >
                        <strong>{formatTimeLabel(slot)}</strong>
                        <small>{isSelected ? "Selected" : "Available"}</small>
                      </Link>
                    );
                  })}
                </div>

                {isAvailabilityLoading ? (
                  <p className="booking-helper-text">Loading live availability from the backend...</p>
                ) : null}
                {!isAvailabilityLoading && selectedDate && timeSlots.length === 0 ? (
                  <p className="booking-helper-text">
                    No available slots remain for this date. Try another day.
                  </p>
                ) : null}
                {!selectedDate ? (
                  <p className="booking-helper-text">Select a date before choosing a time slot.</p>
                ) : null}
              </div>
            </div>

            <aside className="booking-schedule-summary">
              <div className="booking-schedule-summary-head">
                <h3>Appointment Summary</h3>
                <p>Review your current selection before continuing.</p>
              </div>

              <div className="booking-schedule-summary-list">
                <div className="booking-schedule-summary-item">
                  <span className="booking-schedule-summary-icon" aria-hidden="true">
                    <LocationIcon />
                  </span>
                  <div className="booking-schedule-summary-copy">
                    <span>Branch</span>
                    <strong>{selectedBranch.name}</strong>
                  </div>
                </div>

                <div className="booking-schedule-summary-item">
                  <span className="booking-schedule-summary-icon" aria-hidden="true">
                    <ServiceIcon />
                  </span>
                  <div className="booking-schedule-summary-copy">
                    <span>Service</span>
                    <strong>{selectedService.title}</strong>
                  </div>
                </div>

                <div className="booking-schedule-summary-item">
                  <span className="booking-schedule-summary-icon" aria-hidden="true">
                    <CalendarIcon />
                  </span>
                  <div className="booking-schedule-summary-copy">
                    <span>Date</span>
                    <strong>{selectedDateLabel}</strong>
                  </div>
                </div>

                <div className="booking-schedule-summary-item">
                  <span className="booking-schedule-summary-icon" aria-hidden="true">
                    <ClockIcon />
                  </span>
                  <div className="booking-schedule-summary-copy">
                    <span>Selected Slot</span>
                    <strong>{selectedTimeLabel}</strong>
                  </div>
                </div>
              </div>

              <div className="booking-schedule-summary-duration">
                <span>Estimated Duration</span>
                <strong>{selectedService.duration}</strong>
              </div>

              <div className="booking-schedule-summary-actions">
                {selectedDate && selectedTime ? (
                  <Link
                    href={buildBranchesUrl(
                      role,
                      {
                        branch: selectedBranch.id,
                        service: selectedService.id,
                        date: selectedDate.value,
                        time: selectedTime,
                      },
                      "booking-summary",
                    )}
                    className="portal-primary-button"
                  >
                    Continue to Review
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="portal-primary-button booking-confirm-button"
                    disabled
                  >
                    Select date and time
                  </button>
                )}
              </div>

              <p className="booking-schedule-summary-note">
                Your appointment is only created after the final confirmation step.
              </p>
            </aside>
          </div>
        ) : (
          <div className="booking-empty-state">
            Select a branch and service first to see available dates and appointment times.
          </div>
        )}
      </section>

      <section className="booking-step-section" id="booking-summary">
        <div className="booking-section-header">
          <div>
            <p className="branches-kicker">Step 4</p>
            <h2>Book appointment</h2>
          </div>
          <span className="booking-step-status">
            {isConfirmed ? "Confirmed" : "Review booking"}
          </span>
        </div>

        <div className="booking-summary-grid">
          <div className="booking-summary-card">
            <h3>Booking summary</h3>
            <p className="booking-helper-text">
              Review the final details before creating the appointment in the backend.
            </p>
            <div className="booking-summary-list">
              <div className="booking-summary-item">
                <span>Branch</span>
                <strong>{selectedBranch?.name ?? "Not selected"}</strong>
              </div>
              <div className="booking-summary-item">
                <span>Service</span>
                <strong>{selectedService?.title ?? "Not selected"}</strong>
              </div>
              <div className="booking-summary-item">
                <span>Date</span>
                <strong>{selectedDate?.longLabel ?? "Not selected"}</strong>
              </div>
              <div className="booking-summary-item">
                <span>Time</span>
                <strong>{selectedTime ? formatTimeLabel(selectedTime) : "Not selected"}</strong>
              </div>
            </div>

            {selectedBranch && selectedService && selectedDate && selectedTime ? (
              <BookingConfirmButton
                branchId={Number(selectedBranch.id)}
                serviceId={Number(selectedService.id)}
                startTime={toIsoStartTime(selectedDate.value, selectedTime)}
              />
            ) : (
              <button
                type="button"
                className="portal-primary-button booking-confirm-button"
                disabled
              >
                Complete previous steps
              </button>
            )}
          </div>

          <aside className="booking-summary-card booking-summary-side">
            <h3>Before you book</h3>
            <div className="booking-review-list">
              <div className="booking-review-item">
                <strong>Arrival</strong>
                <p>Plan to arrive 10 minutes early so your assigned staff member can start on time.</p>
              </div>
              <div className="booking-review-item">
                <strong>Documents</strong>
                <p>Bring the documents required for the service you selected at this branch.</p>
              </div>
              <div className="booking-review-item">
                <strong>Preparation</strong>
                <p>Your selected slot is checked against the backend at confirmation so staff only see valid appointments.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </section>
  );
}
