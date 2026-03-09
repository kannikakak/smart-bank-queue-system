package com.smartq.api.branch.domain;

import com.smartq.api.catalog.domain.ServiceOffering;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "branch_services")
public class BranchServiceMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @ManyToOne(optional = false)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceOffering service;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    protected BranchServiceMapping() {
    }

    public BranchServiceMapping(Branch branch, ServiceOffering service, boolean active) {
        this.branch = branch;
        this.service = service;
        this.active = active;
    }
}
