package com.smartq.api.branch.dto;

public record BranchSummary(
    Long id,
    String name,
    String city,
    String openingHours,
    int activeCounters
) {
}

