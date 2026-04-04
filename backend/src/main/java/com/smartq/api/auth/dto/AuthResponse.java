package com.smartq.api.auth.dto;

import java.util.List;

public record AuthResponse(
    String accessToken,
    String role,
    String roleLabel,
    List<String> permissions,
    String displayName
) {
}

