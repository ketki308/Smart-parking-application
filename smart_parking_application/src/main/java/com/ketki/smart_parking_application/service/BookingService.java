package com.ketki.smart_parking_application.service;

import com.ketki.smart_parking_application.entity.Booking;
import com.ketki.smart_parking_application.entity.ParkingSlot;
import com.ketki.smart_parking_application.entity.User;
import com.ketki.smart_parking_application.exception.ResourceNotFoundException;
import com.ketki.smart_parking_application.repository.BookingRepository;
import com.ketki.smart_parking_application.repository.ParkingSlotRepository;
import com.ketki.smart_parking_application.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ParkingSlotRepository slotRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          ParkingSlotRepository slotRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.slotRepository = slotRepository;
        this.userRepository = userRepository;
    }

    // ─────────────────────────────────────────
    // Book a slot
    // ─────────────────────────────────────────
    @Transactional
    public Booking bookSlot(int slotNumber, String username) {

        // Load user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        // ── One user can reserve only one slot ──────────────────────
        boolean hasActiveBooking = bookingRepository
                .findByUserAndStatus(user, Booking.BookingStatus.ACTIVE)
                .size() > 0;
        if (hasActiveBooking) {
            throw new IllegalStateException("You already have an active booking. Cancel it first.");
        }

        // Load slot
        ParkingSlot slot = slotRepository.findBySlotNumber(slotNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Slot #" + slotNumber + " not found"));

        // Check slot is FREE
        if (slot.getStatus() != ParkingSlot.Status.FREE) {
            throw new IllegalStateException("Slot #" + slotNumber + " is not available");
        }

        // Check slot not already actively booked
        if (bookingRepository.existsBySlotAndStatus(slot, Booking.BookingStatus.ACTIVE)) {
            throw new IllegalStateException("Slot #" + slotNumber + " is already booked");
        }

        // Mark slot as RESERVED
        slot.setStatus(ParkingSlot.Status.RESERVED);
        slotRepository.save(slot);

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setSlot(slot);
        booking.setStatus(Booking.BookingStatus.ACTIVE);

        return bookingRepository.save(booking);
    }

    // ─────────────────────────────────────────
    // Cancel a booking
    // ─────────────────────────────────────────
    @Transactional
    public Booking cancelBooking(Long bookingId, String username) {

        // Load booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking #" + bookingId + " not found"));

        // Make sure the booking belongs to this user
        if (!booking.getUser().getUsername().equals(username)) {
            throw new IllegalStateException("You can only cancel your own bookings");
        }

        // Make sure booking is still active
        if (booking.getStatus() != Booking.BookingStatus.ACTIVE) {
            throw new IllegalStateException("Booking #" + bookingId + " is not active");
        }

        // Mark slot back as FREE
        ParkingSlot slot = booking.getSlot();
        slot.setStatus(ParkingSlot.Status.FREE);
        slotRepository.save(slot);

        // Update booking
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    // ─────────────────────────────────────────
    // Get current user's bookings
    // ─────────────────────────────────────────
    public List<Booking> getMyBookings(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return bookingRepository.findByUser(user);
    }

    // ─────────────────────────────────────────
    // Get current user's active bookings only
    // ─────────────────────────────────────────
    public List<Booking> getMyActiveBookings(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return bookingRepository.findByUserAndStatus(user, Booking.BookingStatus.ACTIVE);
    }

    // ─────────────────────────────────────────
    // Admin — get all bookings
    // ─────────────────────────────────────────
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ─────────────────────────────────────────
    // Admin — get bookings by status
    // ─────────────────────────────────────────
    public List<Booking> getBookingsByStatus(Booking.BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }
}