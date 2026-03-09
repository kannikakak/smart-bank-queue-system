package com.smartq.api.branch.controller;

import com.smartq.api.branch.dto.BranchSummary;
import com.smartq.api.branch.repository.BranchRepository;
import com.smartq.api.staff.repository.StaffBranchAssignmentRepository;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/branches")
public class BranchController {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private final BranchRepository branchRepository;
    private final StaffBranchAssignmentRepository staffBranchAssignmentRepository;

    public BranchController(
        BranchRepository branchRepository,
        StaffBranchAssignmentRepository staffBranchAssignmentRepository
    ) {
        this.branchRepository = branchRepository;
        this.staffBranchAssignmentRepository = staffBranchAssignmentRepository;
    }

    @GetMapping
    public List<BranchSummary> listBranches() {
        return branchRepository.findByActiveTrueOrderByNameAsc().stream()
            .map(branch -> new BranchSummary(
                branch.getId(),
                branch.getName(),
                branch.getAddress(),
                branch.getOpenTime().format(TIME_FORMATTER) + " - " + branch.getCloseTime().format(TIME_FORMATTER),
                Math.toIntExact(staffBranchAssignmentRepository.countByBranch_IdAndActiveTrue(branch.getId()))
            ))
            .toList();
    }
}
