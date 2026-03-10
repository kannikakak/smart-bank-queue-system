package com.smartq.api.auth.repository;

import com.smartq.api.auth.domain.AppUser;
import com.smartq.api.auth.domain.UserRole;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmailIgnoreCaseAndActiveTrue(String email);

    long countByRoleAndActiveTrue(UserRole role);
}
