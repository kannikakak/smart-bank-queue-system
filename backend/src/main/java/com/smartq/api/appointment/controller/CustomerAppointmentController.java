package com.smartq.api.appointment.controller;

import com.smartq.api.appointment.dto.AppointmentDetail;
import com.smartq.api.appointment.dto.AppointmentSummary;
import com.smartq.api.appointment.dto.AppointmentTimelineEvent;
import com.smartq.api.appointment.dto.CreateAppointmentRequest;
import com.smartq.api.appointment.dto.RescheduleAppointmentRequest;
import com.smartq.api.appointment.repository.AppointmentRepository;
import com.smartq.api.appointment.service.CustomerAppointmentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/customer/appointments")
public class CustomerAppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final CustomerAppointmentService customerAppointmentService;

    public CustomerAppointmentController(
        AppointmentRepository appointmentRepository,
        CustomerAppointmentService customerAppointmentService
    ) {
        this.appointmentRepository = appointmentRepository;
        this.customerAppointmentService = customerAppointmentService;
    }

    @GetMapping
    public List<AppointmentSummary> customerAppointments(Authentication authentication) {
        return appointmentRepository.findByCustomer_EmailIgnoreCaseOrderByStartTimeAsc(authentication.getName()).stream()
            .map(appointment -> new AppointmentSummary(
                appointment.getId(),
                appointment.getBranch().getName(),
                appointment.getService().getName(),
                appointment.getStartTime(),
                appointment.getStatus()
            ))
            .toList();
    }

    @GetMapping("/{appointmentId}")
    public AppointmentDetail appointmentDetail(@PathVariable Long appointmentId, Authentication authentication) {
        return customerAppointmentService.getAppointmentDetail(authentication.getName(), appointmentId);
    }

    @GetMapping("/{appointmentId}/timeline")
    public List<AppointmentTimelineEvent> appointmentTimeline(
        @PathVariable Long appointmentId,
        Authentication authentication
    ) {
        return customerAppointmentService.getAppointmentTimeline(authentication.getName(), appointmentId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentSummary createAppointment(
        @Valid @RequestBody CreateAppointmentRequest request,
        Authentication authentication
    ) {
        return customerAppointmentService.createAppointment(authentication.getName(), request);
    }

    @PatchMapping("/{appointmentId}")
    public AppointmentSummary rescheduleAppointment(
        @PathVariable Long appointmentId,
        @Valid @RequestBody RescheduleAppointmentRequest request,
        Authentication authentication
    ) {
        return customerAppointmentService.rescheduleAppointment(authentication.getName(), appointmentId, request);
    }

    @DeleteMapping("/{appointmentId}")
    public AppointmentSummary cancelAppointment(
        @PathVariable Long appointmentId,
        Authentication authentication
    ) {
        return customerAppointmentService.cancelAppointment(authentication.getName(), appointmentId);
    }
}
