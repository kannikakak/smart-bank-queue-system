package com.smartq.api.appointment.dto;

import java.time.LocalDateTime;

public record AvailableSlotSummary(
    LocalDateTime startTime,
    LocalDateTime endTime,
    int remainingCapacity
) {
}
