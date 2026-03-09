package com.smartq.api.appointment.controller;

import com.smartq.api.appointment.dto.AppointmentSummary;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/customer/appointments")
public class CustomerAppointmentController {

    @GetMapping
    public List<AppointmentSummary> customerAppointments() {
        return List.of(
            new AppointmentSummary(1001L, "Downtown Branch", "Account Opening", "2026-03-09T10:30:00", "WAITING"),
            new AppointmentSummary(1002L, "Central Branch", "Card Replacement", "2026-03-12T14:00:00", "WAITING")
        );
    }
}
