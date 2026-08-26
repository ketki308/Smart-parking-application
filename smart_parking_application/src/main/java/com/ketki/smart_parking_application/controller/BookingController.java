package com.ketki.smart_parking_application.controller;

import com.ketki.smart_parking_application.entity.Booking;
import com.ketki.smart_parking_application.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // ─────────────────────────────────────────
    // IMPORTANT: specific routes MUST come
    // before dynamic /{variable} routes
    // otherwise Spring matches "my" as a slot number
    // ─────────────────────────────────────────

    // GET /api/bookings/my
    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookingService.getMyBookings(userDetails.getUsername()));
    }

    // GET /api/bookings/my/active
    @GetMapping("/my/active")
    public ResponseEntity<List<Booking>> getMyActiveBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookingService.getMyActiveBookings(userDetails.getUsername()));
    }

    // GET /api/bookings — Admin only
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // GET /api/bookings/status/{status} — Admin only
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getByStatus(
            @PathVariable Booking.BookingStatus status) {
        return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
    }

    // POST /api/bookings/{slotNumber} — Book a slot
    @PostMapping("/{slotNumber}")
    public ResponseEntity<Booking> bookSlot(
            @PathVariable int slotNumber,
            @AuthenticationPrincipal UserDetails userDetails) {
        Booking booking = bookingService.bookSlot(slotNumber, userDetails.getUsername());
        return ResponseEntity.ok(booking);
    }

    // PUT /api/bookings/{bookingId}/cancel — Cancel a booking
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Booking booking = bookingService.cancelBooking(bookingId, userDetails.getUsername());
        return ResponseEntity.ok(booking);
    }
}