package com.smartq.api.staff.repository;

import com.smartq.api.staff.domain.StaffBranchAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffBranchAssignmentRepository extends JpaRepository<StaffBranchAssignment, Long> {

    long countByBranch_IdAndActiveTrue(Long branchId);
}
