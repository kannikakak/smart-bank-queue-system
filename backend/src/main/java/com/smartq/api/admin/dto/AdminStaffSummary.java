package com.smartq.api.admin.dto;

public record AdminStaffSummary(
    Long id,
    String fullName,
    String email,
    String phone,
    String branch,
    String roleTitle,
    String status,
    int completedToday,
    int activeAppointments,
    int efficiencyScore
) {
}
