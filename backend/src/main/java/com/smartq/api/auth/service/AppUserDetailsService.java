package com.smartq.api.auth.service;

import com.smartq.api.auth.domain.AppUser;
import com.smartq.api.auth.domain.UserPermission;
import java.util.ArrayList;
import com.smartq.api.auth.repository.AppUserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final AppUserRepository userRepository;

    public AppUserDetailsService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<AppUser> findByEmail(String email) {
        return buildEmailCandidates(email).stream()
            .map(userRepository::findByEmailIgnoreCaseAndActiveTrue)
            .filter(Optional::isPresent)
            .map(Optional::get)
            .findFirst();
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        AppUser user = findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<SimpleGrantedAuthority> authorities = new ArrayList<>(user.getRole()
            .getPermissions()
            .stream()
            .map(UserPermission::name)
            .map(SimpleGrantedAuthority::new)
            .toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        return User.withUsername(user.getEmail())
            .password(user.getPasswordHash())
            .authorities(authorities)
            .disabled(!user.isActive())
            .build();
    }

    private List<String> buildEmailCandidates(String email) {
        String normalized = email == null ? "" : email.trim().toLowerCase();
        List<String> candidates = new ArrayList<>();

        if (normalized.isBlank()) {
            return candidates;
        }

        candidates.add(normalized);

        if (normalized.endsWith("@smartq.local")) {
            candidates.add(normalized.replace("@smartq.local", "@smartqbank.com"));
        } else if (normalized.endsWith("@smartqbank.com")) {
            candidates.add(normalized.replace("@smartqbank.com", "@smartq.local"));
        }

        return candidates.stream().distinct().toList();
    }
}
