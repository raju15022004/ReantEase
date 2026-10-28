package com.rentease.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_bookings_property_status", columnList = "property_id,status"),
    @Index(name = "idx_bookings_student", columnList = "student_id,created_at")
})
public class Booking extends AuditedEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    @Column(name = "move_in_date", nullable = false)
    private LocalDate moveInDate;
    @Column(length = 2000)
    private String message;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private BookingStatus status = BookingStatus.PENDING;

    public Long getId() { return id; }
    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public LocalDate getMoveInDate() { return moveInDate; }
    public void setMoveInDate(LocalDate moveInDate) { this.moveInDate = moveInDate; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
}
