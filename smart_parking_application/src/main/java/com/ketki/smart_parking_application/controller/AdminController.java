package com.ketki.smart_parking_application.controller;

import com.ketki.smart_parking_application.entity.ParkingSlot;
import com.ketki.smart_parking_application.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ─────────────────────────────────────────
    // PUT /api/admin/slots/{slotNumber}/status
    // Admin manually changes slot status
    // Body: "FREE" or "OCCUPIED" or "RESERVED"
    // ─────────────────────────────────────────
    @PutMapping("/slots/{slotNumber}/status")
    public ResponseEntity<ParkingSlot> updateSlotStatus(
            @PathVariable int slotNumber,
            @RequestParam ParkingSlot.Status status) {

        return ResponseEntity.ok(adminService.updateSlotStatus(slotNumber, status));
    }

    // ─────────────────────────────────────────
    // PUT /api/admin/bookings/cancel-stale?hours=2
    // Cancel all active bookings older than X hours
    // ─────────────────────────────────────────
    @PutMapping("/bookings/cancel-stale")
    public ResponseEntity<String> cancelStaleBookings(
            @RequestParam(defaultValue = "2") int hours) {

        int count = adminService.cancelStaleBookings(hours);
        return ResponseEntity.ok(count + " stale booking(s) cancelled older than " + hours + " hour(s)");
    }

    // ─────────────────────────────────────────
    // POST /api/admin/slots
    // Admin adds a new parking slot
    // Body: slotNumber as request param
    // ─────────────────────────────────────────
    @PostMapping("/slots")
    public ResponseEntity<ParkingSlot> addSlot(
            @RequestParam int slotNumber) {

        return ResponseEntity.ok(adminService.addSlot(slotNumber));
    }

    // ─────────────────────────────────────────
    // DELETE /api/admin/slots/{slotNumber}
    // Admin deletes a slot — only FREE slots
    // ─────────────────────────────────────────
    @DeleteMapping("/slots/{slotNumber}")
    public ResponseEntity<String> deleteSlot(
            @PathVariable int slotNumber) {

        adminService.deleteSlot(slotNumber);
        return ResponseEntity.ok("Slot #" + slotNumber + " deleted successfully");
    }
}