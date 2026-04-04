package com.smartq.api.config;

import com.smartq.api.appointment.domain.Appointment;
import com.smartq.api.appointment.repository.AppointmentRepository;
import com.smartq.api.auth.domain.AppUser;
import com.smartq.api.auth.domain.UserRole;
import com.smartq.api.auth.repository.AppUserRepository;
import com.smartq.api.branch.domain.Branch;
import com.smartq.api.branch.domain.BranchServiceMapping;
import com.smartq.api.branch.repository.BranchRepository;
import com.smartq.api.branch.repository.BranchServiceMappingRepository;
import com.smartq.api.catalog.domain.ServiceOffering;
import com.smartq.api.catalog.repository.ServiceOfferingRepository;
import com.smartq.api.notification.domain.Notification;
import com.smartq.api.notification.repository.NotificationRepository;
import com.smartq.api.queue.domain.QueueEvent;
import com.smartq.api.queue.repository.QueueEventRepository;
import com.smartq.api.staff.domain.StaffBranchAssignment;
import com.smartq.api.staff.repository.StaffBranchAssignmentRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final AppUserRepository userRepository;
    private final BranchRepository branchRepository;
    private final ServiceOfferingRepository serviceRepository;
    private final BranchServiceMappingRepository branchServiceMappingRepository;
    private final StaffBranchAssignmentRepository staffBranchAssignmentRepository;
    private final AppointmentRepository appointmentRepository;
    private final QueueEventRepository queueEventRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(
        AppUserRepository userRepository,
        BranchRepository branchRepository,
        ServiceOfferingRepository serviceRepository,
        BranchServiceMappingRepository branchServiceMappingRepository,
        StaffBranchAssignmentRepository staffBranchAssignmentRepository,
        AppointmentRepository appointmentRepository,
        QueueEventRepository queueEventRepository,
        NotificationRepository notificationRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.branchRepository = branchRepository;
        this.serviceRepository = serviceRepository;
        this.branchServiceMappingRepository = branchServiceMappingRepository;
        this.staffBranchAssignmentRepository = staffBranchAssignmentRepository;
        this.appointmentRepository = appointmentRepository;
        this.queueEventRepository = queueEventRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0 || branchRepository.count() > 0 || serviceRepository.count() > 0) {
            return;
        }

        LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);

        AppUser customer = new AppUser(
            "Customer One",
            "customer@smartqbank.com",
            "+85510123456",
            passwordEncoder.encode("Customer@123"),
            UserRole.CUSTOMER,
            true,
            now,
            now
        );
        AppUser staffOfficer = new AppUser(
            "Staff Officer",
            "staff@smartqbank.com",
            "+85510999001",
            passwordEncoder.encode("Staff@123"),
            UserRole.STAFF,
            true,
            now,
            now
        );
        AppUser teller = new AppUser(
            "Teller Officer",
            "teller@smartqbank.com",
            "+85510999002",
            passwordEncoder.encode("Staff@123"),
            UserRole.STAFF,
            true,
            now,
            now
        );
        AppUser advisor = new AppUser(
            "Loan Advisor",
            "advisor@smartqbank.com",
            "+85510999003",
            passwordEncoder.encode("Staff@123"),
            UserRole.STAFF,
            true,
            now,
            now
        );
        AppUser admin = new AppUser(
            "Branch Manager",
            "admin@smartqbank.com",
            "+85510999004",
            passwordEncoder.encode("Admin@123"),
            UserRole.ADMIN,
            true,
            now,
            now
        );
        userRepository.saveAll(List.of(customer, staffOfficer, teller, advisor, admin));

        Branch downtownBranch = new Branch(
            "Downtown Branch",
            "123 Norodom Blvd, Phnom Penh",
            "+85523999001",
            LocalTime.of(8, 0),
            LocalTime.of(17, 0),
            new BigDecimal("11.5564000"),
            new BigDecimal("104.9282000"),
            true,
            now
        );
        Branch centralBranch = new Branch(
            "Central Branch",
            "88 Kampuchea Krom Blvd, Phnom Penh",
            "+85523999002",
            LocalTime.of(8, 30),
            LocalTime.of(17, 30),
            new BigDecimal("11.5673000"),
            new BigDecimal("104.9145000"),
            true,
            now
        );
        Branch riversideBranch = new Branch(
            "Riverside Branch",
            "15 Sivatha Rd, Siem Reap",
            "+85563999003",
            LocalTime.of(8, 0),
            LocalTime.of(16, 30),
            new BigDecimal("13.3610000"),
            new BigDecimal("103.8565000"),
            true,
            now
        );
        branchRepository.saveAll(List.of(downtownBranch, centralBranch, riversideBranch));

        ServiceOffering accountOpening = new ServiceOffering("Account Opening", 30, true, now);
        ServiceOffering loanConsultation = new ServiceOffering("Loan Consultation", 45, true, now);
        ServiceOffering cashDeposit = new ServiceOffering("Cash Deposit", 10, true, now);
        ServiceOffering cardReplacement = new ServiceOffering("Card Replacement", 20, true, now);
        serviceRepository.saveAll(List.of(accountOpening, loanConsultation, cashDeposit, cardReplacement));

        branchServiceMappingRepository.saveAll(List.of(
            new BranchServiceMapping(downtownBranch, accountOpening, true),
            new BranchServiceMapping(downtownBranch, cashDeposit, true),
            new BranchServiceMapping(downtownBranch, cardReplacement, true),
            new BranchServiceMapping(centralBranch, accountOpening, true),
            new BranchServiceMapping(centralBranch, loanConsultation, true),
            new BranchServiceMapping(centralBranch, cardReplacement, true),
            new BranchServiceMapping(riversideBranch, cashDeposit, true),
            new BranchServiceMapping(riversideBranch, loanConsultation, true)
        ));

        staffBranchAssignmentRepository.saveAll(List.of(
            new StaffBranchAssignment(staffOfficer, downtownBranch, true),
            new StaffBranchAssignment(teller, downtownBranch, true),
            new StaffBranchAssignment(advisor, centralBranch, true),
            new StaffBranchAssignment(admin, riversideBranch, true)
        ));

        Appointment upcomingAppointment = new Appointment(
            customer,
            downtownBranch,
            accountOpening,
            staffOfficer,
            now.plusDays(1).withHour(10).withMinute(30),
            now.plusDays(1).withHour(11).withMinute(0),
            "WAITING",
            null,
            null,
            null,
            now
        );
        Appointment completedAppointment = new Appointment(
            customer,
            centralBranch,
            cardReplacement,
            advisor,
            now.minusDays(2).withHour(14).withMinute(0),
            now.minusDays(2).withHour(14).withMinute(20),
            "COMPLETED",
            now.minusDays(2).withHour(13).withMinute(55),
            now.minusDays(2).withHour(14).withMinute(0),
            now.minusDays(2).withHour(14).withMinute(18),
            now.minusDays(4)
        );
        appointmentRepository.saveAll(List.of(upcomingAppointment, completedAppointment));

        queueEventRepository.saveAll(List.of(
            new QueueEvent(upcomingAppointment, "CREATED", null, "WAITING", customer, now, "Appointment booked online"),
            new QueueEvent(completedAppointment, "CREATED", null, "WAITING", customer, now.minusDays(4), "Appointment booked online"),
            new QueueEvent(completedAppointment, "CHECKED_IN", "WAITING", "READY", staffOfficer, now.minusDays(2).withHour(13).withMinute(55), "Customer arrived"),
            new QueueEvent(completedAppointment, "SERVICE_STARTED", "READY", "IN_SERVICE", advisor, now.minusDays(2).withHour(14).withMinute(0), "Service started"),
            new QueueEvent(completedAppointment, "SERVICE_COMPLETED", "IN_SERVICE", "COMPLETED", advisor, now.minusDays(2).withHour(14).withMinute(18), "Service completed")
        ));

        notificationRepository.saveAll(List.of(
            new Notification(
                upcomingAppointment,
                "EMAIL",
                "BOOKING_CONFIRMATION",
                customer.getEmail(),
                "SENT",
                now,
                now,
                now
            ),
            new Notification(
                completedAppointment,
                "SMS",
                "QUEUE_UPDATE",
                customer.getPhone(),
                "SENT",
                now.minusDays(2).withHour(13).withMinute(50),
                now.minusDays(2).withHour(13).withMinute(50),
                now.minusDays(2).withHour(13).withMinute(50)
            )
        ));
    }
}
