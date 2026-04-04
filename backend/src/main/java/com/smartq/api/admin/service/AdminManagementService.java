package com.smartq.api.admin.service;

import com.smartq.api.admin.dto.AdminAppointmentSummary;
import com.smartq.api.admin.dto.AdminBranchRequest;
import com.smartq.api.admin.dto.AdminBranchResponse;
import com.smartq.api.admin.dto.AdminServiceRequest;
import com.smartq.api.admin.dto.AdminServiceResponse;
import com.smartq.api.admin.dto.AdminStaffSummary;
import com.smartq.api.analytics.dto.AdminOverview;
import com.smartq.api.appointment.domain.Appointment;
import com.smartq.api.appointment.repository.AppointmentRepository;
import com.smartq.api.auth.domain.AppUser;
import com.smartq.api.auth.domain.UserRole;
import com.smartq.api.auth.repository.AppUserRepository;
import com.smartq.api.branch.domain.Branch;
import com.smartq.api.branch.repository.BranchRepository;
import com.smartq.api.catalog.domain.ServiceOffering;
import com.smartq.api.catalog.repository.ServiceOfferingRepository;
import com.smartq.api.staff.domain.StaffBranchAssignment;
import com.smartq.api.staff.repository.StaffBranchAssignmentRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminManagementService {

    private final BranchRepository branchRepository;
    private final ServiceOfferingRepository serviceOfferingRepository;
    private final StaffBranchAssignmentRepository staffBranchAssignmentRepository;
    private final AppointmentRepository appointmentRepository;
    private final AppUserRepository appUserRepository;

    public AdminManagementService(
        BranchRepository branchRepository,
        ServiceOfferingRepository serviceOfferingRepository,
        StaffBranchAssignmentRepository staffBranchAssignmentRepository,
        AppointmentRepository appointmentRepository,
        AppUserRepository appUserRepository
    ) {
        this.branchRepository = branchRepository;
        this.serviceOfferingRepository = serviceOfferingRepository;
        this.staffBranchAssignmentRepository = staffBranchAssignmentRepository;
        this.appointmentRepository = appointmentRepository;
        this.appUserRepository = appUserRepository;
    }

    @Transactional(readOnly = true)
    public AdminOverview getOverview() {
        List<Appointment> appointments = appointmentRepository.findAllByOrderByStartTimeAsc();

        Map<String, String> metrics = Map.of(
            "activeBranches", String.valueOf(branchRepository.countByActiveTrue()),
            "activeServices", String.valueOf(serviceOfferingRepository.countByActiveTrue()),
            "activeCustomers", String.valueOf(appUserRepository.countByRoleAndActiveTrue(UserRole.CUSTOMER)),
            "activeStaff", String.valueOf(appUserRepository.countByRoleAndActiveTrue(UserRole.STAFF)),
            "totalAppointments", String.valueOf(appointments.size()),
            "waitingAppointments", String.valueOf(countByStatus(appointments, "WAITING")),
            "completedAppointments", String.valueOf(countByStatus(appointments, "COMPLETED")),
            "cancelledAppointments", String.valueOf(countByStatus(appointments, "CANCELLED"))
        );

        List<String> peakHours = appointments.stream()
            .collect(Collectors.groupingBy(
                appointment -> appointment.getStartTime().getHour(),
                Collectors.counting()
            ))
            .entrySet().stream()
            .sorted(Map.Entry.<Integer, Long>comparingByValue().reversed())
            .limit(3)
            .map(entry -> String.format("%02d:00 - %02d:00", entry.getKey(), (entry.getKey() + 1) % 24))
            .toList();

        List<String> topServices = appointments.stream()
            .collect(Collectors.groupingBy(
                appointment -> appointment.getService().getName(),
                Collectors.counting()
            ))
            .entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(3)
            .map(Map.Entry::getKey)
            .toList();

        return new AdminOverview(metrics, peakHours, topServices);
    }

    @Transactional(readOnly = true)
    public List<AdminBranchResponse> listBranches() {
        return branchRepository.findAllByOrderByNameAsc().stream()
            .map(this::toBranchResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public AdminBranchResponse getBranch(Long id) {
        return toBranchResponse(findBranch(id));
    }

    @Transactional
    public AdminBranchResponse createBranch(AdminBranchRequest request) {
        LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);
        Branch branch = branchRepository.save(new Branch(
            request.name().trim(),
            request.address().trim(),
            request.phone(),
            request.openTime(),
            request.closeTime(),
            request.latitude(),
            request.longitude(),
            request.active(),
            now
        ));

        return toBranchResponse(branch);
    }

    @Transactional
    public AdminBranchResponse updateBranch(Long id, AdminBranchRequest request) {
        Branch branch = findBranch(id);
        branch.update(
            request.name().trim(),
            request.address().trim(),
            request.phone(),
            request.openTime(),
            request.closeTime(),
            request.latitude(),
            request.longitude(),
            request.active()
        );
        return toBranchResponse(branch);
    }

    @Transactional
    public void deleteBranch(Long id) {
        findBranch(id).deactivate();
    }

    @Transactional(readOnly = true)
    public List<AdminServiceResponse> listServices() {
        return serviceOfferingRepository.findAllByOrderByNameAsc().stream()
            .map(this::toServiceResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public AdminServiceResponse getService(Long id) {
        return toServiceResponse(findService(id));
    }

    @Transactional
    public AdminServiceResponse createService(AdminServiceRequest request) {
        String name = request.name().trim();
        if (serviceOfferingRepository.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Service name already exists");
        }

        ServiceOffering service = serviceOfferingRepository.save(new ServiceOffering(
            name,
            request.durationMinutes(),
            request.active(),
            LocalDateTime.now().withSecond(0).withNano(0)
        ));

        return toServiceResponse(service);
    }

    @Transactional
    public AdminServiceResponse updateService(Long id, AdminServiceRequest request) {
        ServiceOffering service = findService(id);
        String name = request.name().trim();
        if (serviceOfferingRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Service name already exists");
        }

        service.update(name, request.durationMinutes(), request.active());
        return toServiceResponse(service);
    }

    @Transactional
    public void deleteService(Long id) {
        findService(id).deactivate();
    }

    @Transactional(readOnly = true)
    public List<AdminAppointmentSummary> listAppointments() {
        return appointmentRepository.findAllByOrderByStartTimeAsc().stream()
            .sorted(Comparator.comparing(Appointment::getStartTime))
            .map(this::toAppointmentSummary)
            .toList();
    }

    @Transactional
    public AdminAppointmentSummary checkInAppointment(Long appointmentId) {
        Appointment appointment = findAppointment(appointmentId);
        if (!"WAITING".equalsIgnoreCase(appointment.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only waiting appointments can be checked in");
        }

        appointment.checkIn(LocalDateTime.now().withSecond(0).withNano(0));
        return toAppointmentSummary(appointment);
    }

    @Transactional(readOnly = true)
    public List<AdminStaffSummary> listStaff() {
        List<AppUser> staffUsers = appUserRepository.findAllByRoleAndActiveTrueOrderByFullNameAsc(UserRole.STAFF);
        List<StaffBranchAssignment> assignments = staffBranchAssignmentRepository.findAllByActiveTrue();
        List<Appointment> appointments = appointmentRepository.findAllByOrderByStartTimeAsc();
        LocalDate today = LocalDate.now();

        Map<Long, String> branchByStaffId = assignments.stream()
            .collect(Collectors.toMap(
                assignment -> assignment.getStaff().getId(),
                assignment -> assignment.getBranch().getName(),
                (current, ignored) -> current
            ));

        Map<Long, List<Appointment>> appointmentsByStaffId = appointments.stream()
            .filter(appointment -> appointment.getStaff() != null)
            .collect(Collectors.groupingBy(appointment -> appointment.getStaff().getId()));

        return staffUsers.stream()
            .map(staff -> toStaffSummary(staff, branchByStaffId.get(staff.getId()), appointmentsByStaffId.get(staff.getId()), today))
            .toList();
    }

    private long countByStatus(List<Appointment> appointments, String status) {
        return appointments.stream()
            .filter(appointment -> status.equalsIgnoreCase(appointment.getStatus()))
            .count();
    }

    private Appointment findAppointment(Long id) {
        return appointmentRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));
    }

    private Branch findBranch(Long id) {
        return branchRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Branch not found"));
    }

    private ServiceOffering findService(Long id) {
        return serviceOfferingRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
    }

    private AdminBranchResponse toBranchResponse(Branch branch) {
        return new AdminBranchResponse(
            branch.getId(),
            branch.getName(),
            branch.getAddress(),
            branch.getPhone(),
            branch.getOpenTime(),
            branch.getCloseTime(),
            branch.getLatitude(),
            branch.getLongitude(),
            branch.isActive(),
            Math.toIntExact(staffBranchAssignmentRepository.countByBranch_IdAndActiveTrue(branch.getId())),
            branch.getCreatedAt()
        );
    }

    private AdminServiceResponse toServiceResponse(ServiceOffering service) {
        return new AdminServiceResponse(
            service.getId(),
            service.getName(),
            service.getDurationMinutes(),
            service.isActive(),
            service.getCreatedAt()
        );
    }

    private AdminAppointmentSummary toAppointmentSummary(Appointment appointment) {
        return new AdminAppointmentSummary(
            appointment.getId(),
            appointment.getCustomer().getFullName(),
            appointment.getCustomer().getEmail(),
            appointment.getBranch().getName(),
            appointment.getService().getName(),
            appointment.getStartTime(),
            appointment.getEndTime(),
            appointment.getStatus(),
            appointment.getStaff() != null ? appointment.getStaff().getFullName() : null
        );
    }

    private AdminStaffSummary toStaffSummary(
        AppUser staff,
        String branchName,
        List<Appointment> staffAppointments,
        LocalDate today
    ) {
        List<Appointment> appointments = staffAppointments == null ? List.of() : staffAppointments;

        int completedToday = (int) appointments.stream()
            .filter(appointment -> "COMPLETED".equalsIgnoreCase(appointment.getStatus()))
            .filter(appointment -> appointment.getStartTime().toLocalDate().isEqual(today))
            .count();

        int activeAppointments = (int) appointments.stream()
            .filter(appointment -> appointment.getStartTime().toLocalDate().isEqual(today))
            .filter(appointment -> isActiveStaffStatus(appointment.getStatus()))
            .count();

        String status = activeAppointments > 0
            ? "BUSY"
            : branchName != null
                ? "ONLINE"
                : "OFFLINE";

        int efficiencyScore = Math.min(
            98,
            Math.max(42, 58 + completedToday * 9 + (branchName != null ? 8 : 0) - activeAppointments * 3)
        );

        String roleTitle = completedToday >= 5
            ? "Senior Advisor"
            : activeAppointments >= 2
                ? "Service Officer"
                : "Branch Associate";

        return new AdminStaffSummary(
            staff.getId(),
            staff.getFullName(),
            staff.getEmail(),
            staff.getPhone(),
            branchName != null ? branchName : "Unassigned",
            roleTitle,
            status,
            completedToday,
            activeAppointments,
            efficiencyScore
        );
    }

    private boolean isActiveStaffStatus(String status) {
        return "WAITING".equalsIgnoreCase(status)
            || "READY".equalsIgnoreCase(status)
            || "IN_SERVICE".equalsIgnoreCase(status);
    }
}
