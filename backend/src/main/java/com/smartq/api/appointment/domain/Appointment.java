package com.smartq.api.appointment.domain;

import com.smartq.api.auth.domain.AppUser;
import com.smartq.api.branch.domain.Branch;
import com.smartq.api.catalog.domain.ServiceOffering;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private AppUser customer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @ManyToOne(optional = false)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceOffering service;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private AppUser staff;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    @Column(name = "service_start_at")
    private LocalDateTime serviceStartAt;

    @Column(name = "service_end_at")
    private LocalDateTime serviceEndAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected Appointment() {
    }

    public Appointment(
        AppUser customer,
        Branch branch,
        ServiceOffering service,
        AppUser staff,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String status,
        LocalDateTime checkedInAt,
        LocalDateTime serviceStartAt,
        LocalDateTime serviceEndAt,
        LocalDateTime createdAt
    ) {
        this.customer = customer;
        this.branch = branch;
        this.service = service;
        this.staff = staff;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.checkedInAt = checkedInAt;
        this.serviceStartAt = serviceStartAt;
        this.serviceEndAt = serviceEndAt;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Branch getBranch() {
        return branch;
    }

    public ServiceOffering getService() {
        return service;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public String getStatus() {
        return status;
    }
}
