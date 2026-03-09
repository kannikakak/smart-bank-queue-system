package com.smartq.api.analytics.dto;

import java.util.List;
import java.util.Map;

public record AdminOverview(
    Map<String, String> metrics,
    List<String> peakHours,
    List<String> topServices
) {
}

