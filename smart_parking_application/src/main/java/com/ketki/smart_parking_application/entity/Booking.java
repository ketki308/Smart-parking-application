package com.ketki.smart_parking_application.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which user made this booking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Which slot is booked
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private ParkingSlot slot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime bookedAt;

    private LocalDateTime cancelledAt;

    public enum BookingStatus {
        ACTIVE,
        CANCELLED,
        COMPLETED
    }
}