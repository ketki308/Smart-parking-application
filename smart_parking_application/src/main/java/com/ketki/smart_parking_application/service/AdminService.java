package com.ketki.smart_parking_application.service;

import com.ketki.smart_parking_application.entity.Booking;
import com.ketki.smart_parking_application.entity.ParkingSlot;
import com.ketki.smart_parking_application.exception.ResourceNotFoundException;
import com.ketki.smart_parking_application.repository.BookingRepository;
import com.ketki.smart_parking_application.repository.ParkingSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {

    private final ParkingSlotRepository slotRepository;
    private final BookingRepository bookingRepository;

    public AdminService(ParkingSlotRepository slotRepository,
                        BookingRepository bookingRepository) {
        this.slotRepository = slotRepository;
        this.bookingRepository = bookingRepository;
    }

    // ─────────────────────────────────────────
    // Feature 1 — Change slot status manually
    // ─────────────────────────────────────────
    @Transactional
    public ParkingSlot updateSlotStatus(int slotNumber, ParkingSlot.Status status) {
        ParkingSlot slot = slotRepository.findBySlotNumber(slotNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Slot #" + slotNumber + " not found"));

        slot.setStatus(status);
        return slotRepository.save(slot);
    }

    // ─────────────────────────────────────────
    // Feature 2 — Cancel stale bookings
    // Cancels all ACTIVE bookings older than
    // given hours and frees their slots
    // ─────────────────────────────────────────
    @Transactional
    public int cancelStaleBookings(int hours) {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(hours);

        List<Booking> staleBookings = bookingRepository
                .findByStatus(Booking.BookingStatus.ACTIVE)
                .stream()
                .filter(b -> b.getBookedAt().isBefore(cutoff))
                .toList();

        for (Booking booking : staleBookings) {
            // Free the slot
            ParkingSlot slot = booking.getSlot();
            slot.setStatus(ParkingSlot.Status.FREE);
            slotRepository.save(slot);

            // Cancel the booking
            booking.setStatus(Booking.BookingStatus.CANCELLED);
            booking.setCancelledAt(LocalDateTime.now());
            bookingRepository.save(booking);
        }

        return staleBookings.size(); // Return count of cancelled bookings
    }

    // ─────────────────────────────────────────
    // Feature 3 — Add a new slot
    // ─────────────────────────────────────────
    @Transactional
    public ParkingSlot addSlot(int slotNumber) {
        if (slotRepository.existsBySlotNumber(slotNumber)) {
            throw new IllegalArgumentException("Slot #" + slotNumber + " already exists");
        }

        ParkingSlot slot = new ParkingSlot();
        slot.setSlotNumber(slotNumber);
        slot.setStatus(ParkingSlot.Status.FREE);

        return slotRepository.save(slot);
    }

    // ─────────────────────────────────────────
    // Feature 4 — Delete a slot
    // Only FREE slots can be deleted
    // ─────────────────────────────────────────
    @Transactional
    public void deleteSlot(int slotNumber) {
        ParkingSlot slot = slotRepository.findBySlotNumber(slotNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Slot #" + slotNumber + " not found"));

        if (slot.getStatus() != ParkingSlot.Status.FREE) {
            throw new IllegalStateException("Slot #" + slotNumber + " cannot be deleted — it is " + slot.getStatus());
        }

        slotRepository.delete(slot);
    }
}