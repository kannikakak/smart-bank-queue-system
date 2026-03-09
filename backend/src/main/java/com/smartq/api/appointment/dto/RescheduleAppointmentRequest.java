package com.smartq.api.appointment.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record RescheduleAppointmentRequest(@NotNull @Future LocalDateTime startTime) {
}
