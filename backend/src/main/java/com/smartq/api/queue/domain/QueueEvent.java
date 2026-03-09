package com.smartq.api.queue.domain;

import com.smartq.api.appointment.domain.Appointment;
import com.smartq.api.auth.domain.AppUser;
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
@Table(name = "queue_events")
public class QueueEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(nullable = false, length = 30)
    private String action;

    @Column(name = "from_status", length = 20)
    private String fromStatus;

    @Column(name = "to_status", length = 20)
    private String toStatus;

    @ManyToOne
    @JoinColumn(name = "performed_by")
    private AppUser performedBy;

    @Column(name = "event_time", nullable = false)
    private LocalDateTime eventTime;

    @Column(columnDefinition = "text")
    private String note;

    protected QueueEvent() {
    }

    public QueueEvent(
        Appointment appointment,
        String action,
        String fromStatus,
        String toStatus,
        AppUser performedBy,
        LocalDateTime eventTime,
        String note
    ) {
        this.appointment = appointment;
        this.action = action;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.performedBy = performedBy;
        this.eventTime = eventTime;
        this.note = note;
    }

    public Long getId() {
        return id;
    }

    public String getAction() {
        return action;
    }

    public String getFromStatus() {
        return fromStatus;
    }

    public String getToStatus() {
        return toStatus;
    }

    public AppUser getPerformedBy() {
        return performedBy;
    }

    public LocalDateTime getEventTime() {
        return eventTime;
    }

    public String getNote() {
        return note;
    }
}
