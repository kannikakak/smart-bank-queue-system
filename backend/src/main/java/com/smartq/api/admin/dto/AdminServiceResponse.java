package com.smartq.api.admin.dto;

import java.time.LocalDateTime;

public record AdminServiceResponse(
    Long id,
    String name,
    int durationMinutes,
    boolean active,
    LocalDateTime createdAt
) {
}
