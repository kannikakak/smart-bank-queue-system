package com.smartq.api.queue.dto;

public record QueueTicket(
    String ticketNumber,
    String customerName,
    String service,
    String status,
    String estimatedCallTime
) {
}

