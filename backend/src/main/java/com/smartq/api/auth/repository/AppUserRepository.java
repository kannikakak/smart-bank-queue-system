package com.smartq.api.auth.repository;

import com.smartq.api.auth.domain.AppUser;
import com.smartq.api.auth.domain.UserRole;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    boolean existsByEmailIgnoreCase(String email);

    Optional<AppUser> findByEmailIgnoreCaseAndActiveTrue(String email);

    List<AppUser> findAllByRoleAndActiveTrue(UserRole role);

    List<AppUser> findAllByRoleAndActiveTrueOrderByFullNameAsc(UserRole role);

    long countByRoleAndActiveTrue(UserRole role);
}
