package com.smartq.api.admin.controller;

import com.smartq.api.admin.dto.AdminServiceRequest;
import com.smartq.api.admin.dto.AdminServiceResponse;
import com.smartq.api.admin.service.AdminManagementService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/services")
public class AdminServiceController {

    private final AdminManagementService adminManagementService;

    public AdminServiceController(AdminManagementService adminManagementService) {
        this.adminManagementService = adminManagementService;
    }

    @GetMapping
    public List<AdminServiceResponse> listServices() {
        return adminManagementService.listServices();
    }

    @GetMapping("/{id}")
    public AdminServiceResponse getService(@PathVariable Long id) {
        return adminManagementService.getService(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdminServiceResponse createService(@Valid @RequestBody AdminServiceRequest request) {
        return adminManagementService.createService(request);
    }

    @PutMapping("/{id}")
    public AdminServiceResponse updateService(@PathVariable Long id, @Valid @RequestBody AdminServiceRequest request) {
        return adminManagementService.updateService(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteService(@PathVariable Long id) {
        adminManagementService.deleteService(id);
    }
}
