package com.smartq.api.appointment.service;

import com.smartq.api.appointment.domain.Appointment;
import com.smartq.api.appointment.dto.AvailableSlotSummary;
import com.smartq.api.appointment.dto.AppointmentDetail;
import com.smartq.api.appointment.dto.AppointmentSummary;
import com.smartq.api.appointment.dto.AppointmentTimelineEvent;
import com.smartq.api.appointment.dto.CreateAppointmentRequest;
import com.smartq.api.appointment.dto.RescheduleAppointmentRequest;
import com.smartq.api.appointment.repository.AppointmentRepository;
import com.smartq.api.auth.domain.AppUser;
import com.smartq.api.auth.domain.UserRole;
import com.smartq.api.auth.repository.AppUserRepository;
import com.smartq.api.branch.domain.Branch;
import com.smartq.api.branch.repository.BranchRepository;
import com.smartq.api.branch.repository.BranchServiceMappingRepository;
import com.smartq.api.catalog.domain.ServiceOffering;
import com.smartq.api.catalog.repository.ServiceOfferingRepository;
import com.smartq.api.notification.domain.Notification;
import com.smartq.api.notification.repository.NotificationRepository;
import com.smartq.api.queue.domain.QueueEvent;
import com.smartq.api.queue.repository.QueueEventRepository;
import com.smartq.api.staff.repository.StaffBranchAssignmentRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CustomerAppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppUserRepository appUserRepository;
    private final BranchRepository branchRepository;
    private final BranchServiceMappingRepository branchServiceMappingRepository;
    private final ServiceOfferingRepository serviceOfferingRepository;
    private final QueueEventRepository queueEventRepository;
    private final NotificationRepository notificationRepository;
    private final StaffBranchAssignmentRepository staffBranchAssignmentRepository;

    public CustomerAppointmentService(
        AppointmentRepository appointmentRepository,
        AppUserRepository appUserRepository,
        BranchRepository branchRepository,
        BranchServiceMappingRepository branchServiceMappingRepository,
        ServiceOfferingRepository serviceOfferingRepository,
        QueueEventRepository queueEventRepository,
        NotificationRepository notificationRepository,
        StaffBranchAssignmentRepository staffBranchAssignmentRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.appUserRepository = appUserRepository;
        this.branchRepository = branchRepository;
        this.branchServiceMappingRepository = branchServiceMappingRepository;
        this.serviceOfferingRepository = serviceOfferingRepository;
        this.queueEventRepository = queueEventRepository;
        this.notificationRepository = notificationRepository;
        this.staffBranchAssignmentRepository = staffBranchAssignmentRepository;
    }

    @Transactional
    public AppointmentSummary createAppointment(String customerEmail, CreateAppointmentRequest request) {
        AppUser customer = findActiveCustomer(customerEmail);
        Branch branch = findActiveBranch(request.branchId());
        ServiceOffering service = findActiveService(request.serviceId());

        if (!branchServiceMappingRepository.existsByBranch_IdAndService_IdAndActiveTrue(branch.getId(), service.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected service is not available at this branch");
        }

        LocalDateTime startTime = request.startTime().withSecond(0).withNano(0);
        LocalDateTime endTime = startTime.plusMinutes(service.getDurationMinutes());
        validateBranchHours(branch, startTime, endTime);

        if (appointmentRepository.existsByBranch_IdAndStartTimeLessThanAndEndTimeGreaterThan(branch.getId(), endTime, startTime)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Selected time slot is already booked");
        }

        LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);
        Appointment appointment = appointmentRepository.save(new Appointment(
            customer,
            branch,
            service,
            null,
            startTime,
            endTime,
            "WAITING",
            null,
            null,
            null,
            now
        ));

        queueEventRepository.save(new QueueEvent(
            appointment,
            "CREATED",
            null,
            "WAITING",
            customer,
            now,
            "Appointment booked online"
        ));

        notificationRepository.save(new Notification(
            appointment,
            "EMAIL",
            "BOOKING_CONFIRMATION",
            customer.getEmail(),
            "SENT",
            now,
            now,
            now
        ));
        saveAdminBookingAlerts(appointment, now);

        return new AppointmentSummary(
            appointment.getId(),
            branch.getName(),
            service.getName(),
            appointment.getStartTime(),
            appointment.getStatus()
        );
    }

    @Transactional(readOnly = true)
    public AppointmentDetail getAppointmentDetail(String customerEmail, Long appointmentId) {
        Appointment appointment = findOwnedAppointment(appointmentId, customerEmail);
        return new AppointmentDetail(
            appointment.getId(),
            appointment.getBranch().getName(),
            appointment.getBranch().getAddress(),
            appointment.getService().getName(),
            appointment.getService().getDurationMinutes(),
            appointment.getStartTime(),
            appointment.getEndTime(),
            appointment.getStatus(),
            appointment.getStaff() != null ? appointment.getStaff().getFullName() : null,
            appointment.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<AvailableSlotSummary> getAvailableSlots(Long branchId, Long serviceId, LocalDate date) {
        Branch branch = findActiveBranch(branchId);
        ServiceOffering service = findActiveService(serviceId);

        if (!branchServiceMappingRepository.existsByBranch_IdAndService_IdAndActiveTrue(branch.getId(), service.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected service is not available at this branch");
        }

        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = dayStart.plusDays(1);
        List<Appointment> dayAppointments =
            appointmentRepository.findByBranch_IdAndStartTimeGreaterThanEqualAndStartTimeLessThanOrderByStartTimeAsc(
                branch.getId(),
                dayStart,
                dayEnd
            );

        int serviceDuration = service.getDurationMinutes();
        int slotInterval = Math.min(serviceDuration, 15);
        int branchCapacity = Math.max(1, Math.toIntExact(
            staffBranchAssignmentRepository.countByBranch_IdAndActiveTrue(branch.getId())
        ));

        LocalDateTime candidateStart = LocalDateTime.of(date, branch.getOpenTime());
        LocalDateTime branchClose = LocalDateTime.of(date, branch.getCloseTime());
        LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);

        List<AvailableSlotSummary> slots = new java.util.ArrayList<>();
        while (!candidateStart.plusMinutes(serviceDuration).isAfter(branchClose)) {
            LocalDateTime currentSlotStart = candidateStart;
            LocalDateTime candidateEnd = currentSlotStart.plusMinutes(serviceDuration);
            long overlappingAppointments = dayAppointments.stream()
                .filter(appointment -> !("CANCELLED".equalsIgnoreCase(appointment.getStatus())
                    || "COMPLETED".equalsIgnoreCase(appointment.getStatus())))
                .filter(appointment -> appointment.getStartTime().isBefore(candidateEnd)
                    && appointment.getEndTime().isAfter(currentSlotStart))
                .count();

            if (!currentSlotStart.isBefore(now) && overlappingAppointments < branchCapacity) {
                slots.add(new AvailableSlotSummary(
                    currentSlotStart,
                    candidateEnd,
                    branchCapacity - (int) overlappingAppointments
                ));
            }

            candidateStart = candidateStart.plusMinutes(slotInterval);
        }

        return slots;
    }

    @Transactional(readOnly = true)
    public List<AppointmentTimelineEvent> getAppointmentTimeline(String customerEmail, Long appointmentId) {
        findOwnedAppointment(appointmentId, customerEmail);
        return queueEventRepository.findByAppointment_IdAndAppointment_Customer_EmailIgnoreCaseOrderByEventTimeAsc(
            appointmentId,
            customerEmail
        ).stream()
            .map(event -> new AppointmentTimelineEvent(
                event.getId(),
                event.getAction(),
                event.getFromStatus(),
                event.getToStatus(),
                event.getPerformedBy() != null ? event.getPerformedBy().getFullName() : null,
                event.getEventTime(),
                event.getNote()
            ))
            .toList();
    }

    @Transactional
    public AppointmentSummary rescheduleAppointment(
        String customerEmail,
        Long appointmentId,
        RescheduleAppointmentRequest request
    ) {
        AppUser customer = findActiveCustomer(customerEmail);
        Appointment appointment = findOwnedAppointment(appointmentId, customer.getEmail());
        validateMutableAppointment(appointment);

        LocalDateTime startTime = request.startTime().withSecond(0).withNano(0);
        LocalDateTime endTime = startTime.plusMinutes(appointment.getService().getDurationMinutes());
        validateBranchHours(appointment.getBranch(), startTime, endTime);

        if (appointmentRepository.existsByBranch_IdAndIdNotAndStartTimeLessThanAndEndTimeGreaterThan(
            appointment.getBranch().getId(),
            appointment.getId(),
            endTime,
            startTime
        )) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Selected time slot is already booked");
        }

        LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);
        LocalDateTime previousStart = appointment.getStartTime();
        appointment.reschedule(startTime, endTime);

        queueEventRepository.save(new QueueEvent(
            appointment,
            "RESCHEDULED",
            appointment.getStatus(),
            appointment.getStatus(),
            customer,
            now,
            "Appointment rescheduled from " + previousStart + " to " + startTime
        ));

        notificationRepository.save(new Notification(
            appointment,
            "EMAIL",
            "BOOKING_UPDATED",
            customer.getEmail(),
            "SENT",
            now,
            now,
            now
        ));

        return toSummary(appointment);
    }

    @Transactional
    public AppointmentSummary cancelAppointment(String customerEmail, Long appointmentId) {
        AppUser customer = findActiveCustomer(customerEmail);
        Appointment appointment = findOwnedAppointment(appointmentId, customer.getEmail());
        validateMutableAppointment(appointment);

        String previousStatus = appointment.getStatus();
        LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);
        appointment.updateStatus("CANCELLED");

        queueEventRepository.save(new QueueEvent(
            appointment,
            "CANCELLED",
            previousStatus,
            "CANCELLED",
            customer,
            now,
            "Appointment cancelled by customer"
        ));

        notificationRepository.save(new Notification(
            appointment,
            "EMAIL",
            "BOOKING_CANCELLED",
            customer.getEmail(),
            "SENT",
            now,
            now,
            now
        ));

        return toSummary(appointment);
    }

    private AppUser findActiveCustomer(String customerEmail) {
        return appUserRepository.findByEmailIgnoreCaseAndActiveTrue(customerEmail)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Active customer account not found"));
    }

    private Branch findActiveBranch(Long branchId) {
        return branchRepository.findByIdAndActiveTrue(branchId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Branch not found"));
    }

    private ServiceOffering findActiveService(Long serviceId) {
        return serviceOfferingRepository.findByIdAndActiveTrue(serviceId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
    }

    private Appointment findOwnedAppointment(Long appointmentId, String customerEmail) {
        return appointmentRepository.findByIdAndCustomer_EmailIgnoreCase(appointmentId, customerEmail)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));
    }

    private void validateMutableAppointment(Appointment appointment) {
        if (!"WAITING".equalsIgnoreCase(appointment.getStatus())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Only waiting appointments can be changed by the customer"
            );
        }
    }

    private void validateBranchHours(Branch branch, LocalDateTime startTime, LocalDateTime endTime) {
        LocalTime openingTime = branch.getOpenTime();
        LocalTime closingTime = branch.getCloseTime();
        LocalTime requestedStart = startTime.toLocalTime();
        LocalTime requestedEnd = endTime.toLocalTime();

        if (requestedStart.isBefore(openingTime) || requestedEnd.isAfter(closingTime)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Appointment time is outside branch working hours");
        }
    }

    private AppointmentSummary toSummary(Appointment appointment) {
        return new AppointmentSummary(
            appointment.getId(),
            appointment.getBranch().getName(),
            appointment.getService().getName(),
            appointment.getStartTime(),
            appointment.getStatus()
        );
    }

    private void saveAdminBookingAlerts(Appointment appointment, LocalDateTime now) {
        List<Notification> adminNotifications = appUserRepository.findAllByRoleAndActiveTrue(UserRole.ADMIN).stream()
            .map(admin -> new Notification(
                appointment,
                "SYSTEM",
                "ADMIN_BOOKING_ALERT",
                admin.getEmail(),
                "UNREAD",
                now,
                now,
                now
            ))
            .toList();

        if (!adminNotifications.isEmpty()) {
            notificationRepository.saveAll(adminNotifications);
        }
    }
}
