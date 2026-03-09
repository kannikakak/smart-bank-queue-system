package com.smartq.api.branch.repository;

import com.smartq.api.branch.domain.Branch;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BranchRepository extends JpaRepository<Branch, Long> {

    List<Branch> findByActiveTrueOrderByNameAsc();
}
