package com.smartq.api.appointment.dto;

import java.time.LocalDateTime;

public record AppointmentDetail(
    Long id,
    String branch,
    String branchAddress,
    String service,
    int durationMinutes,
    LocalDateTime scheduledAt,
    LocalDateTime endsAt,
    String status,
    String assignedStaff,
    LocalDateTime createdAt
) {
}
