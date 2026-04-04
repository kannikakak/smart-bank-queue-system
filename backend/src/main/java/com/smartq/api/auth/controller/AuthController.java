package com.smartq.api.auth.controller;

import com.smartq.api.auth.domain.AppUser;
import com.smartq.api.auth.domain.UserRole;
import com.smartq.api.auth.dto.AuthResponse;
import com.smartq.api.auth.dto.LoginRequest;
import com.smartq.api.auth.dto.RegisterRequest;
import com.smartq.api.auth.repository.AppUserRepository;
import com.smartq.api.auth.service.AppUserDetailsService;
import com.smartq.api.security.JwtService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
        AuthenticationManager authenticationManager,
        AppUserDetailsService userDetailsService,
        JwtService jwtService,
        AppUserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        AppUser user = userDetailsService.findByEmail(request.email())
            .orElseThrow(() -> new IllegalStateException("Authenticated user missing"));

        return buildAuthResponse(user);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);
        AppUser user = userRepository.save(new AppUser(
            request.fullName().trim(),
            normalizedEmail,
            null,
            passwordEncoder.encode(request.password()),
            UserRole.CUSTOMER,
            true,
            now,
            now
        ));

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(AppUser user) {
        return new AuthResponse(
            jwtService.generateToken(user),
            user.getRole().name(),
            user.getRole().getDisplayName(),
            user.getRole().getPermissions().stream().map(Enum::name).toList(),
            user.getFullName()
        );
    }
}
