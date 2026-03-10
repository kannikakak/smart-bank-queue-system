package com.smartq.api.queue.dto;

public record QueueTicket(
    Long appointmentId,
    String ticketNumber,
    String branch,
    String customerName,
    String service,
    String scheduledAt,
    String status,
    String assignedStaff,
    String estimatedCallTime
) {
}
