package com.smartq.api.admin.controller;

import com.smartq.api.admin.dto.AdminAppointmentSummary;
import com.smartq.api.admin.service.AdminManagementService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/appointments")
public class AdminAppointmentController {

    private final AdminManagementService adminManagementService;

    public AdminAppointmentController(AdminManagementService adminManagementService) {
        this.adminManagementService = adminManagementService;
    }

    @GetMapping
    public List<AdminAppointmentSummary> listAppointments() {
        return adminManagementService.listAppointments();
    }
}
