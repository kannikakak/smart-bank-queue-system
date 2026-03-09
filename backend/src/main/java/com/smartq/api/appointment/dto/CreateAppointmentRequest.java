package com.smartq.api.appointment.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

public record CreateAppointmentRequest(
    @NotNull @Positive Long branchId,
    @NotNull @Positive Long serviceId,
    @NotNull @Future LocalDateTime startTime
) {
}
