package com.smartq.api.analytics.controller;

import com.smartq.api.analytics.dto.AdminOverview;
import com.smartq.api.admin.service.AdminManagementService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/overview")
public class AdminAnalyticsController {

    private final AdminManagementService adminManagementService;

    public AdminAnalyticsController(AdminManagementService adminManagementService) {
        this.adminManagementService = adminManagementService;
    }

    @GetMapping
    public AdminOverview overview() {
        return adminManagementService.getOverview();
    }
}
