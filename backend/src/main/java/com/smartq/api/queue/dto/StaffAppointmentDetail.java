package com.smartq.api.queue.dto;

import java.time.LocalDateTime;

public record StaffAppointmentDetail(
    Long id,
    String customerName,
    String customerEmail,
    String branch,
    String service,
    String status,
    String assignedStaff,
    LocalDateTime scheduledAt,
    LocalDateTime endsAt,
    LocalDateTime checkedInAt,
    LocalDateTime serviceStartAt,
    LocalDateTime serviceEndAt
) {
}
