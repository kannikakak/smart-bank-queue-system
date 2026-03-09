package com.smartq.api.branch.repository;

import com.smartq.api.branch.domain.Branch;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BranchRepository extends JpaRepository<Branch, Long> {

    List<Branch> findByActiveTrueOrderByNameAsc();

    Optional<Branch> findByIdAndActiveTrue(Long id);
}
