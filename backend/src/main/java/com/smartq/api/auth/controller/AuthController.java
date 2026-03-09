package com.smartq.api.auth.controller;

import com.smartq.api.auth.dto.AuthResponse;
import com.smartq.api.auth.dto.LoginRequest;
import com.smartq.api.auth.domain.DemoUser;
import com.smartq.api.auth.service.DemoIdentityService;
import com.smartq.api.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final DemoIdentityService identityService;
    private final JwtService jwtService;

    public AuthController(
        AuthenticationManager authenticationManager,
        DemoIdentityService identityService,
        JwtService jwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.identityService = identityService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        DemoUser user = identityService.findByEmail(request.email())
            .orElseThrow(() -> new IllegalStateException("Authenticated user missing"));

        return new AuthResponse(
            jwtService.generateToken(user),
            user.role().name(),
            user.displayName()
        );
    }
}

