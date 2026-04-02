import { z } from "zod";
import type { BookingParams } from "@/shared/portal/booking-data";

const bookingIdSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9-]+$/i);

const bookingDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const bookingTimeSchema = z.string().regex(/^\d{2}:\d{2}$/);
const bookingConfirmedSchema = z.literal("1");
const appointmentIdSchema = z.string().regex(/^\d+$/);

function getOptionalValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseOptionalField<T>(schema: z.ZodType<T>, value: unknown) {
  const normalizedValue = getOptionalValue(value);

  if (!normalizedValue) {
    return undefined;
  }

  const result = schema.safeParse(normalizedValue);
  return result.success ? result.data : undefined;
}

export function parseBookingParams(input?: Record<string, unknown> | URLSearchParams): BookingParams {
  const getValue = (key: keyof BookingParams) =>
    input instanceof URLSearchParams ? input.get(key) ?? undefined : input?.[key];

  return {
    branch: parseOptionalField(bookingIdSchema, getValue("branch")),
    service: parseOptionalField(bookingIdSchema, getValue("service")),
    date: parseOptionalField(bookingDateSchema, getValue("date")),
    time: parseOptionalField(bookingTimeSchema, getValue("time")),
    confirmed: parseOptionalField(bookingConfirmedSchema, getValue("confirmed")),
    appointmentId: parseOptionalField(appointmentIdSchema, getValue("appointmentId")),
  };
}
