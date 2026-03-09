package com.smartq.api.queue.controller;

import com.smartq.api.queue.dto.QueueTicket;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/staff/queue")
public class StaffQueueController {

    @GetMapping
    public List<QueueTicket> queue() {
        return List.of(
            new QueueTicket("A-102", "Sokha V.", "Cash Deposit", "IN_PROGRESS", "Now"),
            new QueueTicket("A-103", "Mina T.", "Loan Consultation", "WAITING", "08 min"),
            new QueueTicket("A-104", "Dara L.", "Account Update", "WAITING", "16 min")
        );
    }
}

