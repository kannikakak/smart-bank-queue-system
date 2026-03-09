package com.smartq.api.appointment.dto;

public record AppointmentSummary(
    Long id,
    String branch,
    String service,
    String scheduledAt,
    String status
) {
}

