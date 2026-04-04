package com.smartq.api.admin.controller;

import com.smartq.api.admin.dto.AdminStaffSummary;
import com.smartq.api.admin.service.AdminManagementService;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/staff")
public class AdminStaffController {

    private final AdminManagementService adminManagementService;

    public AdminStaffController(AdminManagementService adminManagementService) {
        this.adminManagementService = adminManagementService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_STAFF')")
    public List<AdminStaffSummary> listStaff() {
        return adminManagementService.listStaff();
    }
}
