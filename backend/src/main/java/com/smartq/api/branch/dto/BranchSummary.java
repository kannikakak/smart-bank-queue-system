package com.smartq.api.branch.dto;

public record BranchSummary(
    Long id,
    String name,
    String address,
    String openingHours,
    int activeCounters
) {
}
