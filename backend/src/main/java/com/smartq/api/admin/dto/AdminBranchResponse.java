package com.smartq.api.admin.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record AdminBranchResponse(
    Long id,
    String name,
    String address,
    String phone,
    LocalTime openTime,
    LocalTime closeTime,
    BigDecimal latitude,
    BigDecimal longitude,
    boolean active,
    int activeCounters,
    LocalDateTime createdAt
) {
}
