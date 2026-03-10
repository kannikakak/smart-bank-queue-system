package com.smartq.api.staff.repository;

import com.smartq.api.staff.domain.StaffBranchAssignment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffBranchAssignmentRepository extends JpaRepository<StaffBranchAssignment, Long> {

    long countByBranch_IdAndActiveTrue(Long branchId);

    List<StaffBranchAssignment> findByStaff_EmailIgnoreCaseAndActiveTrue(String email);
}
