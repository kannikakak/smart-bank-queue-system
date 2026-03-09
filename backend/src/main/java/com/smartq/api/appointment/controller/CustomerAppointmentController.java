package com.smartq.api.appointment.controller;

import com.smartq.api.appointment.dto.AppointmentSummary;
import com.smartq.api.appointment.repository.AppointmentRepository;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/customer/appointments")
public class CustomerAppointmentController {

    private final AppointmentRepository appointmentRepository;

    public CustomerAppointmentController(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
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
}
