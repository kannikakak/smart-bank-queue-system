package com.smartq.api.admin.controller;

import com.smartq.api.admin.dto.AdminBranchRequest;
import com.smartq.api.admin.dto.AdminBranchResponse;
import com.smartq.api.admin.service.AdminManagementService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/v1/admin/branches")
public class AdminBranchController {

    private final AdminManagementService adminManagementService;

    public AdminBranchController(AdminManagementService adminManagementService) {
        this.adminManagementService = adminManagementService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_BRANCHES')")
    public List<AdminBranchResponse> listBranches() {
        return adminManagementService.listBranches();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_BRANCHES')")
    public AdminBranchResponse getBranch(@PathVariable Long id) {
        return adminManagementService.getBranch(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('MANAGE_BRANCHES')")
    public AdminBranchResponse createBranch(@Valid @RequestBody AdminBranchRequest request) {
        return adminManagementService.createBranch(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_BRANCHES')")
    public AdminBranchResponse updateBranch(@PathVariable Long id, @Valid @RequestBody AdminBranchRequest request) {
        return adminManagementService.updateBranch(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('MANAGE_BRANCHES')")
    public void deleteBranch(@PathVariable Long id) {
        adminManagementService.deleteBranch(id);
    }
}
