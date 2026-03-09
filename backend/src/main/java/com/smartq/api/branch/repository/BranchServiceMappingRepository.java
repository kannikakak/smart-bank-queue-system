package com.smartq.api.branch.repository;

import com.smartq.api.branch.domain.BranchServiceMapping;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BranchServiceMappingRepository extends JpaRepository<BranchServiceMapping, Long> {
}
