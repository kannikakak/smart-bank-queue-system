package com.smartq.api.queue.controller;

import com.smartq.api.queue.dto.QueueTicket;
import com.smartq.api.queue.dto.StaffAppointmentDetail;
import com.smartq.api.queue.service.StaffQueueService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/staff/queue")
public class StaffQueueController {

    private final StaffQueueService staffQueueService;

    public StaffQueueController(StaffQueueService staffQueueService) {
        this.staffQueueService = staffQueueService;
    }

    @GetMapping
    public List<QueueTicket> queue(Authentication authentication) {
        return staffQueueService.getQueue(authentication.getName());
    }

    @GetMapping("/{appointmentId}")
    public StaffAppointmentDetail appointment(@PathVariable Long appointmentId, Authentication authentication) {
        return staffQueueService.getAppointment(authentication.getName(), appointmentId);
    }

    @PatchMapping("/{appointmentId}/check-in")
    public StaffAppointmentDetail checkIn(@PathVariable Long appointmentId, Authentication authentication) {
        return staffQueueService.checkIn(authentication.getName(), appointmentId);
    }

    @PatchMapping("/{appointmentId}/start")
    public StaffAppointmentDetail start(@PathVariable Long appointmentId, Authentication authentication) {
        return staffQueueService.startService(authentication.getName(), appointmentId);
    }

    @PatchMapping("/{appointmentId}/complete")
    public StaffAppointmentDetail complete(@PathVariable Long appointmentId, Authentication authentication) {
        return staffQueueService.completeService(authentication.getName(), appointmentId);
    }
}
