package com.smartq.api.appointment.repository;

import com.smartq.api.appointment.domain.Appointment;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findAllByOrderByStartTimeAsc();

    List<Appointment> findByBranch_IdInOrderByStartTimeAsc(List<Long> branchIds);

    List<Appointment> findByCustomer_EmailIgnoreCaseOrderByStartTimeAsc(String email);

    boolean existsByBranch_IdAndStartTimeLessThanAndEndTimeGreaterThan(
        Long branchId,
        LocalDateTime endTime,
        LocalDateTime startTime
    );

    boolean existsByBranch_IdAndIdNotAndStartTimeLessThanAndEndTimeGreaterThan(
        Long branchId,
        Long appointmentId,
        LocalDateTime endTime,
        LocalDateTime startTime
    );

    Optional<Appointment> findByIdAndCustomer_EmailIgnoreCase(Long id, String email);

    Optional<Appointment> findByIdAndBranch_IdIn(Long id, List<Long> branchIds);
}
