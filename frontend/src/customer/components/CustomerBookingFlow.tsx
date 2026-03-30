import Link from "next/link";
import { BookingConfirmButton } from "@/customer/components/BookingConfirmButton";
import { BookingFlowSelect } from "@/customer/components/BookingFlowSelect";
import {
  bookingServices,
  buildBookingsUrl,
  buildBranchesUrl,
  customerBranches,
  formatTimeLabel,
  getBookingSelection,
  getBranchMapUrl,
  getHoursRange,
  type BookingParams,
} from "@/shared/portal/booking-data";
import {
  CheckIcon,
  ClockIcon,
  LocationIcon,
  QueueIcon,
  ServiceIcon,
} from "@/shared/components/portal/PortalIcons";

type CustomerBookingFlowProps = {
  params: BookingParams;
};

export function CustomerBookingFlow({ params }: CustomerBookingFlowProps) {
  const role = "customer";
  const {
    dateOptions,
    selectedBranch,
    selectedService,
    selectedDate,
    timeSlots,
    selectedTime,
    isConfirmed,
  } = getBookingSelection(params);
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
        <h1>Select a Wing Bank Phnom Penh branch, service, date, and time</h1>
        <p>
          Start with Phnom Penh branches only, continue to the service you need, then pick a date
          and time before confirming the booking.
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
      </div>

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
            {selectedBranch ? "Branch selected" : "Required"}
          </span>
        </div>

        <div className="booking-selector-layout">
          <div className="booking-selector-card">
            <div className="booking-selector-copy">
              <p className="branches-kicker">Phnom Penh branches</p>
              <h3>Select from official Wing Bank Phnom Penh branches</h3>
              <p>
                Choose a Phnom Penh branch from the dropdown. After selection, the branch address,
                opening hours, and map access appear on the right.
              </p>
            </div>

            <BookingFlowSelect
              kind="branch"
              role={role}
              selectedValue={selectedBranch?.id}
              placeholder="Choose Phnom Penh branch"
              meta={`${customerBranches.length} branches`}
              hint="Official Wing Bank Phnom Penh branches only"
              hash="service-selection"
              params={params}
              options={customerBranches.map((branch) => ({
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
                    <strong>Service Access</strong>
                    <p>{selectedBranch.queue}</p>
                  </div>
                </div>
              </div>

              <p className="branch-card-note">{selectedBranch.note}</p>

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
              Choose a branch from the dropdown to view its address, open and close time, and map
              location.
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
                <p className="branches-kicker">Wing Bank services</p>
                <h3>Select the service for {selectedBranch.name}</h3>
                <p>
                  Pick one Wing Bank service from the dropdown. The selected service details will
                  show next to it.
                </p>
              </div>

              <BookingFlowSelect
                kind="service"
                role={role}
                selectedValue={selectedService?.id}
                placeholder="Choose Wing Bank service"
                meta={selectedBranch.name}
                hint="Service availability may vary by branch and advisor schedule"
                hash="schedule-selection"
                params={params}
                options={bookingServices.map((service) => ({
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
                Choose a service from the dropdown to see its duration, availability, and selected
                branch.
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
          <div className="booking-schedule-grid">
            <div className="booking-schedule-panel">
              <h3>Choose a date</h3>
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
                      {date.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="booking-schedule-panel">
              <h3>Choose a time</h3>
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
                        {formatTimeLabel(slot)}
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
                      {formatTimeLabel(slot)}
                    </Link>
                  );
                })}
              </div>
              {!selectedDate ? (
                <p className="booking-helper-text">Select a date before choosing a time slot.</p>
              ) : null}
            </div>
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
                href={buildBookingsUrl(role, {
                  branch: selectedBranch.id,
                  service: selectedService.id,
                  date: selectedDate.value,
                  time: selectedTime,
                  confirmed: "1",
                })}
                isConfirmed={isConfirmed}
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
            <p>
              Arrive 10 minutes early with the documents required for your selected banking
              service.
            </p>
            <p>
              Your reserved time slot will be held briefly after the scheduled time, then it will
              return to the live queue.
            </p>
            {isConfirmed ? (
              <div className="booking-confirmation">
                Your booking is confirmed for {selectedDate?.longLabel} at{" "}
                {selectedTime ? formatTimeLabel(selectedTime) : ""} at {selectedBranch?.name}.
              </div>
            ) : (
              <p className="booking-helper-text">
                Review the details on the left, then confirm the appointment.
              </p>
            )}
          </aside>
        </div>
      </section>
    </section>
  );
}
