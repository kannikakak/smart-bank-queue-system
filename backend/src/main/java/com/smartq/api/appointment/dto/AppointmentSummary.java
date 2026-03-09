package com.smartq.api.appointment.dto;

import java.time.LocalDateTime;

public record AppointmentSummary(
    Long id,
    String branch,
    String service,
    LocalDateTime scheduledAt,
    String status
) {
}
