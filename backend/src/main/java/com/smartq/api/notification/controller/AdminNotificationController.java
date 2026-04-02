package com.smartq.api.notification.controller;

import com.smartq.api.notification.domain.Notification;
import com.smartq.api.notification.dto.AdminNotificationSummary;
import com.smartq.api.notification.repository.NotificationRepository;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/admin/notifications")
public class AdminNotificationController {

    private final NotificationRepository notificationRepository;

    public AdminNotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public List<AdminNotificationSummary> notifications(Authentication authentication) {
        return notificationRepository.findTop20ByRecipientIgnoreCaseOrderByCreatedAtDesc(authentication.getName())
            .stream()
            .map(this::toSummary)
            .toList();
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount(Authentication authentication) {
        return Map.of(
            "unreadCount",
            notificationRepository.countByRecipientIgnoreCaseAndStatusIgnoreCase(authentication.getName(), "UNREAD")
        );
    }

    @PatchMapping("/{notificationId}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markRead(@PathVariable Long notificationId, Authentication authentication) {
        Notification notification = notificationRepository.findByIdAndRecipientIgnoreCase(
            notificationId,
            authentication.getName()
        ).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));

        notification.updateStatus("READ");
        notificationRepository.save(notification);
    }

    private AdminNotificationSummary toSummary(Notification notification) {
        return new AdminNotificationSummary(
            notification.getId(),
            notification.getAppointment().getId(),
            notification.getAppointment().getCustomer().getFullName(),
            notification.getAppointment().getBranch().getName(),
            notification.getAppointment().getService().getName(),
            notification.getType(),
            notification.getStatus(),
            notification.getCreatedAt()
        );
    }
}
