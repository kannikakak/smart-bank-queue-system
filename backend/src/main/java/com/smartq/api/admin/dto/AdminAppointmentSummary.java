package com.smartq.api.admin.dto;

import java.time.LocalDateTime;

public record AdminAppointmentSummary(
    Long id,
    String customerName,
    String customerEmail,
    String branch,
    String service,
    LocalDateTime scheduledAt,
    LocalDateTime endsAt,
    String status,
    String assignedStaff
) {
}
