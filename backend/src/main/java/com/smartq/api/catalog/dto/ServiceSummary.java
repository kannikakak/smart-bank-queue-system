package com.smartq.api.catalog.dto;

public record ServiceSummary(
    Long id,
    String name,
    int durationMinutes,
    boolean appointmentRequired
) {
}

