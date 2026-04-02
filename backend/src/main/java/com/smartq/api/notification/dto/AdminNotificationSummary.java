package com.smartq.api.notification.dto;

import java.time.LocalDateTime;

public record AdminNotificationSummary(
    Long id,
    Long appointmentId,
    String customerName,
    String branch,
    String service,
    String type,
    String status,
    LocalDateTime createdAt
) {
}
