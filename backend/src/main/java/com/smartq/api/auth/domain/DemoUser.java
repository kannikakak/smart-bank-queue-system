package com.smartq.api.auth.domain;

public record DemoUser(
    String email,
    String displayName,
    UserRole role,
    String passwordHash
) {
}

