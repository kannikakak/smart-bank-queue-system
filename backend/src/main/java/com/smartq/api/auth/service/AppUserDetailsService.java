package com.smartq.api.auth.service;

import com.smartq.api.auth.domain.AppUser;
import com.smartq.api.auth.repository.AppUserRepository;
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
        return userRepository.findByEmailIgnoreCaseAndActiveTrue(email);
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        AppUser user = findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return User.withUsername(user.getEmail())
            .password(user.getPasswordHash())
            .authorities(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
            .disabled(!user.isActive())
            .build();
    }
}
