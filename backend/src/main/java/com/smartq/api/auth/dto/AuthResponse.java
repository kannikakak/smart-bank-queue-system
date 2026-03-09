package com.smartq.api.auth.dto;

public record AuthResponse(
    String accessToken,
    String role,
    String displayName
) {
}

