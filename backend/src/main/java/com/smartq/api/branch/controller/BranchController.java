package com.smartq.api.branch.controller;

import com.smartq.api.branch.dto.BranchSummary;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/branches")
public class BranchController {

    @GetMapping
    public List<BranchSummary> listBranches() {
        return List.of(
            new BranchSummary(1L, "Downtown Branch", "Phnom Penh", "08:00 - 17:00", 6),
            new BranchSummary(2L, "Central Branch", "Phnom Penh", "08:30 - 17:30", 5),
            new BranchSummary(3L, "Riverside Branch", "Siem Reap", "08:00 - 16:30", 4)
        );
    }
}

