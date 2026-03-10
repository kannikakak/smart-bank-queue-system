package com.smartq.api.admin.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminServiceRequest(
    @NotBlank String name,
    @Min(1) int durationMinutes,
    @NotNull Boolean active
) {
}
