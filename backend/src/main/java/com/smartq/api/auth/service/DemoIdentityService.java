package com.smartq.api.auth.service;

import com.smartq.api.auth.domain.DemoUser;
import com.smartq.api.auth.domain.UserRole;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DemoIdentityService {

    private final Map<String, DemoUser> users;

    public DemoIdentityService(PasswordEncoder passwordEncoder) {
        this.users = new LinkedHashMap<>();
        register("customer@smartq.local", "Customer One", UserRole.CUSTOMER, "Customer@123", passwordEncoder);
        register("staff@smartq.local", "Staff Officer", UserRole.STAFF, "Staff@123", passwordEncoder);
        register("admin@smartq.local", "Branch Manager", UserRole.ADMIN, "Admin@123", passwordEncoder);
    }

    public Optional<DemoUser> findByEmail(String email) {
        return Optional.ofNullable(users.get(email.toLowerCase()));
    }

    public UserDetails toUserDetails(DemoUser user) {
        return User.withUsername(user.email())
            .password(user.passwordHash())
            .authorities(new SimpleGrantedAuthority("ROLE_" + user.role().name()))
            .build();
    }

    private void register(
        String email,
        String displayName,
        UserRole role,
        String rawPassword,
        PasswordEncoder passwordEncoder
    ) {
        users.put(
            email.toLowerCase(),
            new DemoUser(email, displayName, role, passwordEncoder.encode(rawPassword))
        );
    }
}

