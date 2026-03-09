package com.smartq.api.notification.controller;

import com.smartq.api.notification.dto.CustomerNotificationSummary;
import com.smartq.api.notification.repository.NotificationRepository;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/customer/notifications")
public class CustomerNotificationController {

    private final NotificationRepository notificationRepository;

    public CustomerNotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public List<CustomerNotificationSummary> notifications(Authentication authentication) {
        return notificationRepository.findByAppointment_Customer_EmailIgnoreCaseOrderByCreatedAtDesc(authentication.getName())
            .stream()
            .map(notification -> new CustomerNotificationSummary(
                notification.getId(),
                notification.getAppointment().getId(),
                notification.getChannel(),
                notification.getType(),
                notification.getRecipient(),
                notification.getStatus(),
                notification.getScheduledAt(),
                notification.getSentAt(),
                notification.getCreatedAt()
            ))
            .toList();
    }
}
