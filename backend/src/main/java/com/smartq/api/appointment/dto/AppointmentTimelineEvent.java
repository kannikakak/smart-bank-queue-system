package com.smartq.api.appointment.dto;

import java.time.LocalDateTime;

public record AppointmentTimelineEvent(
    Long id,
    String action,
    String fromStatus,
    String toStatus,
    String performedBy,
    LocalDateTime eventTime,
    String note
) {
}
