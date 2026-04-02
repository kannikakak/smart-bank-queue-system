package com.smartq.api.notification.repository;

import com.smartq.api.notification.domain.Notification;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByAppointment_Customer_EmailIgnoreCaseOrderByCreatedAtDesc(String customerEmail);

    List<Notification> findTop20ByRecipientIgnoreCaseOrderByCreatedAtDesc(String recipient);

    long countByRecipientIgnoreCaseAndStatusIgnoreCase(String recipient, String status);

    Optional<Notification> findByIdAndRecipientIgnoreCase(Long id, String recipient);
}
