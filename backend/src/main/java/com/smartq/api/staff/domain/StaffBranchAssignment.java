package com.smartq.api.staff.domain;

import com.smartq.api.auth.domain.AppUser;
import com.smartq.api.branch.domain.Branch;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "staff_branch")
public class StaffBranchAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "staff_id", nullable = false)
    private AppUser staff;

    @ManyToOne(optional = false)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    protected StaffBranchAssignment() {
    }

    public StaffBranchAssignment(AppUser staff, Branch branch, boolean active) {
        this.staff = staff;
        this.branch = branch;
        this.active = active;
    }
}
