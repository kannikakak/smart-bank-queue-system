package com.smartq.api.queue.repository;

import com.smartq.api.queue.domain.QueueEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QueueEventRepository extends JpaRepository<QueueEvent, Long> {
}
