package com.smartq.api.notification.dto;

import java.time.LocalDateTime;

public record CustomerNotificationSummary(
    Long id,
    Long appointmentId,
    String channel,
    String type,
    String recipient,
    String status,
    LocalDateTime scheduledAt,
    LocalDateTime sentAt,
    LocalDateTime createdAt
) {
}
