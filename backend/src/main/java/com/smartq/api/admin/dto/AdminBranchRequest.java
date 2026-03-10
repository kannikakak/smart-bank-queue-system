package com.smartq.api.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalTime;

public record AdminBranchRequest(
    @NotBlank String name,
    @NotBlank String address,
    String phone,
    @NotNull LocalTime openTime,
    @NotNull LocalTime closeTime,
    BigDecimal latitude,
    BigDecimal longitude,
    @NotNull Boolean active
) {
}
