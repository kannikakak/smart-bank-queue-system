package com.smartq.api.analytics.controller;

import com.smartq.api.analytics.dto.AdminOverview;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/overview")
public class AdminAnalyticsController {

    @GetMapping
    public AdminOverview overview() {
        return new AdminOverview(
            Map.of(
                "averageWaitMinutes", "14",
                "dailyVolume", "126",
                "cancellationRate", "6%",
                "onTimeServiceRate", "84%"
            ),
            List.of("09:00 - 11:00", "13:30 - 15:00"),
            List.of("Cash Deposit", "Account Opening", "Loan Consultation")
        );
    }
}
