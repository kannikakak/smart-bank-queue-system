"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { buildBranchesUrl, type BookingParams } from "@/shared/portal/booking-data";
import type { PortalRole } from "@/shared/portal/portal-role";

type BookingFlowSelectProps = {
  kind: "branch" | "service";
  role: PortalRole;
  selectedValue?: string;
  placeholder: string;
  meta?: string;
  hint?: string;
  hash: string;
  params: BookingParams;
  options: Array<{
    id: string;
    label: string;
  }>;
};

export function BookingFlowSelect({
  kind,
  role,
  selectedValue,
  placeholder,
  meta,
  hint,
  hash,
  params,
  options,
}: BookingFlowSelectProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isDisabled = isPending || (kind === "service" && !params.branch);
  const selectedOption = options.find((option) => option.id === selectedValue);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleSelect(value?: string) {
    const nextParams: BookingParams =
      kind === "branch"
        ? {
            branch: value,
          }
        : {
            branch: params.branch,
            service: value,
          };

    setIsOpen(false);

    startTransition(() => {
      router.push(buildBranchesUrl(role, nextParams, hash));
    });
  }

  return (
    <label className="booking-select-label">
      <div className="booking-select-head">
        <span>{placeholder}</span>
        {meta ? <em className="booking-select-meta">{meta}</em> : null}
      </div>

      <div
        ref={containerRef}
        className={`booking-select-shell ${isOpen ? "is-open" : ""} ${isDisabled ? "is-disabled" : ""}`.trim()}
      >
        <button
          type="button"
          className="booking-select-trigger"
          onClick={() => {
            if (!isDisabled) {
              setIsOpen((current) => !current);
            }
          }}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={isDisabled}
        >
          <span className={selectedOption ? "booking-select-value" : "booking-select-placeholder"}>
            {selectedOption?.label ?? placeholder}
          </span>
          <span className="booking-select-caret" aria-hidden="true">
            v
          </span>
        </button>

        {isOpen ? (
          <div className="booking-select-menu" role="listbox">
            <button
              type="button"
              className={`booking-select-option ${!selectedValue ? "is-selected" : ""}`.trim()}
              onClick={() => handleSelect(undefined)}
            >
              {placeholder}
            </button>
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`booking-select-option ${selectedValue === option.id ? "is-selected" : ""}`.trim()}
                onClick={() => handleSelect(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {hint ? <small className="booking-select-hint">{hint}</small> : null}
    </label>
  );
}
