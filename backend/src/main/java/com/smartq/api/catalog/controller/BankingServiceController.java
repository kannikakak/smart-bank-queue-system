package com.smartq.api.catalog.controller;

import com.smartq.api.catalog.dto.ServiceSummary;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/services")
public class BankingServiceController {

    @GetMapping
    public List<ServiceSummary> listServices() {
        return List.of(
            new ServiceSummary(1L, "Account Opening", 30, true),
            new ServiceSummary(2L, "Loan Consultation", 45, true),
            new ServiceSummary(3L, "Cash Deposit", 10, false),
            new ServiceSummary(4L, "Card Replacement", 20, true)
        );
    }
}

