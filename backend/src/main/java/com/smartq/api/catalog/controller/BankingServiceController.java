package com.smartq.api.catalog.controller;

import com.smartq.api.catalog.dto.ServiceSummary;
import com.smartq.api.catalog.repository.ServiceOfferingRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/services")
public class BankingServiceController {

    private final ServiceOfferingRepository serviceOfferingRepository;

    public BankingServiceController(ServiceOfferingRepository serviceOfferingRepository) {
        this.serviceOfferingRepository = serviceOfferingRepository;
    }

    @GetMapping
    public List<ServiceSummary> listServices() {
        return serviceOfferingRepository.findByActiveTrueOrderByNameAsc().stream()
            .map(service -> new ServiceSummary(
                service.getId(),
                service.getName(),
                service.getDurationMinutes(),
                true
            ))
            .toList();
    }
}
