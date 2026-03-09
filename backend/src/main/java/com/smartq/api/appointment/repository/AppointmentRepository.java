package com.smartq.api.appointment.repository;

import com.smartq.api.appointment.domain.Appointment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByCustomer_EmailIgnoreCaseOrderByStartTimeAsc(String email);
}
