package com.smartq.api.queue.repository;

import com.smartq.api.queue.domain.QueueEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QueueEventRepository extends JpaRepository<QueueEvent, Long> {

    List<QueueEvent> findByAppointment_IdAndAppointment_Customer_EmailIgnoreCaseOrderByEventTimeAsc(
        Long appointmentId,
        String customerEmail
    );
}
