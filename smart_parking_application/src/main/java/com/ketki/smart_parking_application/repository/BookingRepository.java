package com.ketki.smart_parking_application.repository;

import com.ketki.smart_parking_application.entity.Booking;
import com.ketki.smart_parking_application.entity.ParkingSlot;
import com.ketki.smart_parking_application.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Get all bookings for a specific user
    List<Booking> findByUser(User user);

    // Get all active bookings for a specific user
    List<Booking> findByUserAndStatus(User user, Booking.BookingStatus status);

    // Check if a slot is already actively booked
    boolean existsBySlotAndStatus(ParkingSlot slot, Booking.BookingStatus status);

    // Get active booking for a specific slot
    Optional<Booking> findBySlotAndStatus(ParkingSlot slot, Booking.BookingStatus status);

    // Admin — get all bookings by status
    List<Booking> findByStatus(Booking.BookingStatus status);
}