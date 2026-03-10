package com.smartq.api.queue.service;

import com.smartq.api.appointment.domain.Appointment;
import com.smartq.api.appointment.repository.AppointmentRepository;
import com.smartq.api.auth.domain.AppUser;
import com.smartq.api.auth.repository.AppUserRepository;
import com.smartq.api.notification.domain.Notification;
import com.smartq.api.notification.repository.NotificationRepository;
import com.smartq.api.queue.domain.QueueEvent;
import com.smartq.api.queue.dto.QueueTicket;
import com.smartq.api.queue.dto.StaffAppointmentDetail;
import com.smartq.api.queue.repository.QueueEventRepository;
import com.smartq.api.staff.repository.StaffBranchAssignmentRepository;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StaffQueueService {

    private final AppointmentRepository appointmentRepository;
    private final AppUserRepository appUserRepository;
    private final StaffBranchAssignmentRepository staffBranchAssignmentRepository;
    private final QueueEventRepository queueEventRepository;
    private final NotificationRepository notificationRepository;

    public StaffQueueService(
        AppointmentRepository appointmentRepository,
        AppUserRepository appUserRepository,
        StaffBranchAssignmentRepository staffBranchAssignmentRepository,
        QueueEventRepository queueEventRepository,
        NotificationRepository notificationRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.appUserRepository = appUserRepository;
        this.staffBranchAssignmentRepository = staffBranchAssignmentRepository;
        this.queueEventRepository = queueEventRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public List<QueueTicket> getQueue(String staffEmail) {
        List<Long> branchIds = assignedBranchIds(staffEmail);
        if (branchIds.isEmpty()) {
            return List.of();
        }

        return appointmentRepository.findByBranch_IdInOrderByStartTimeAsc(branchIds).stream()
            .filter(appointment -> !("CANCELLED".equalsIgnoreCase(appointment.getStatus())
                || "COMPLETED".equalsIgnoreCase(appointment.getStatus())))
            .map(this::toQueueTicket)
            .toList();
    }

    @Transactional(readOnly = true)
    public StaffAppointmentDetail getAppointment(String staffEmail, Long appointmentId) {
        return toDetail(findAssignedAppointment(staffEmail, appointmentId));
    }

    @Transactional
    public StaffAppointmentDetail checkIn(String staffEmail, Long appointmentId) {
        AppUser staff = findActiveUser(staffEmail);
        Appointment appointment = findAssignedAppointment(staffEmail, appointmentId);
        if (!"WAITING".equalsIgnoreCase(appointment.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only waiting appointments can be checked in");
        }

        LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);
        appointment.checkIn(now);
        queueEventRepository.save(new QueueEvent(
            appointment,
            "CHECKED_IN",
            "WAITING",
            "READY",
            staff,
            now,
            "Customer checked in by staff"
        ));
        saveNotification(appointment, "QUEUE_UPDATE", now);
        return toDetail(appointment);
    }

    @Transactional
    public StaffAppointmentDetail startService(String staffEmail, Long appointmentId) {
        AppUser staff = findActiveUser(staffEmail);
        Appointment appointment = findAssignedAppointment(staffEmail, appointmentId);
        if (!"READY".equalsIgnoreCase(appointment.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only ready appointments can start service");
        }

        LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);
        appointment.startService(staff, now);
        queueEventRepository.save(new QueueEvent(
            appointment,
            "SERVICE_STARTED",
            "READY",
            "IN_SERVICE",
            staff,
            now,
            "Service started by staff"
        ));
        saveNotification(appointment, "QUEUE_UPDATE", now);
        return toDetail(appointment);
    }

    @Transactional
    public StaffAppointmentDetail completeService(String staffEmail, Long appointmentId) {
        AppUser staff = findActiveUser(staffEmail);
        Appointment appointment = findAssignedAppointment(staffEmail, appointmentId);
        if (!"IN_SERVICE".equalsIgnoreCase(appointment.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only in-service appointments can be completed");
        }

        LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);
        appointment.completeService(now);
        queueEventRepository.save(new QueueEvent(
            appointment,
            "SERVICE_COMPLETED",
            "IN_SERVICE",
            "COMPLETED",
            staff,
            now,
            "Service completed by staff"
        ));
        saveNotification(appointment, "QUEUE_UPDATE", now);
        return toDetail(appointment);
    }

    private List<Long> assignedBranchIds(String staffEmail) {
        return staffBranchAssignmentRepository.findByStaff_EmailIgnoreCaseAndActiveTrue(staffEmail).stream()
            .map(assignment -> assignment.getBranch().getId())
            .distinct()
            .toList();
    }

    private Appointment findAssignedAppointment(String staffEmail, Long appointmentId) {
        List<Long> branchIds = assignedBranchIds(staffEmail);
        if (branchIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Staff is not assigned to any active branch");
        }

        return appointmentRepository.findByIdAndBranch_IdIn(appointmentId, branchIds)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));
    }

    private AppUser findActiveUser(String staffEmail) {
        return appUserRepository.findByEmailIgnoreCaseAndActiveTrue(staffEmail)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Active staff account not found"));
    }

    private QueueTicket toQueueTicket(Appointment appointment) {
        return new QueueTicket(
            appointment.getId(),
            "A-" + String.format("%03d", appointment.getId()),
            appointment.getBranch().getName(),
            appointment.getCustomer().getFullName(),
            appointment.getService().getName(),
            appointment.getStartTime().toString(),
            appointment.getStatus(),
            appointment.getStaff() != null ? appointment.getStaff().getFullName() : null,
            estimatedCallTime(appointment)
        );
    }

    private StaffAppointmentDetail toDetail(Appointment appointment) {
        return new StaffAppointmentDetail(
            appointment.getId(),
            appointment.getCustomer().getFullName(),
            appointment.getCustomer().getEmail(),
            appointment.getBranch().getName(),
            appointment.getService().getName(),
            appointment.getStatus(),
            appointment.getStaff() != null ? appointment.getStaff().getFullName() : null,
            appointment.getStartTime(),
            appointment.getEndTime(),
            appointment.getCheckedInAt(),
            appointment.getServiceStartAt(),
            appointment.getServiceEndAt()
        );
    }

    private String estimatedCallTime(Appointment appointment) {
        if ("IN_SERVICE".equalsIgnoreCase(appointment.getStatus()) || appointment.getStartTime().isBefore(LocalDateTime.now())) {
            return "Now";
        }

        long minutes = Math.max(0, Duration.between(LocalDateTime.now(), appointment.getStartTime()).toMinutes());
        return minutes + " min";
    }

    private void saveNotification(Appointment appointment, String type, LocalDateTime now) {
        notificationRepository.save(new Notification(
            appointment,
            "EMAIL",
            type,
            appointment.getCustomer().getEmail(),
            "SENT",
            now,
            now,
            now
        ));
    }
}
