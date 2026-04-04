package com.smartq.api.auth.domain;

import java.util.List;

public enum UserRole {
    CUSTOMER(
        "Customer",
        List.of(
            UserPermission.BOOK_APPOINTMENT,
            UserPermission.MANAGE_OWN_APPOINTMENTS,
            UserPermission.VIEW_OWN_QUEUE_STATUS
        )
    ),
    STAFF(
        "Bank Staff",
        List.of(
            UserPermission.VIEW_ASSIGNED_APPOINTMENTS,
            UserPermission.MANAGE_QUEUE,
            UserPermission.UPDATE_APPOINTMENT_STATUS,
            UserPermission.VIEW_BRANCH_WORKLOAD
        )
    ),
    ADMIN(
        "Branch Manager",
        List.of(
            UserPermission.MANAGE_BRANCHES,
            UserPermission.MANAGE_SERVICES,
            UserPermission.MANAGE_STAFF,
            UserPermission.VIEW_ANALYTICS,
            UserPermission.VIEW_REPORTS,
            UserPermission.MANAGE_APPOINTMENTS
        )
    );

    private final String displayName;
    private final List<UserPermission> permissions;

    UserRole(String displayName, List<UserPermission> permissions) {
        this.displayName = displayName;
        this.permissions = List.copyOf(permissions);
    }

    public String getDisplayName() {
        return displayName;
    }

    public List<UserPermission> getPermissions() {
        return permissions;
    }
}

