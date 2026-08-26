package com.ketki.smart_parking_application.controller;

import com.ketki.smart_parking_application.dto.UpdateSlotRequest;
import com.ketki.smart_parking_application.entity.ParkingSlot;
import com.ketki.smart_parking_application.service.ParkingSlotService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class ParkingSlotController {

    private final ParkingSlotService service;

    // Constructor injection
    public ParkingSlotController(ParkingSlotService service) {
        this.service = service;
    }

    // Update slot status (called by IoT sensors or admin)
    @PostMapping("/update")
    public ResponseEntity<String> updateSlot(@Valid @RequestBody UpdateSlotRequest request) {
        service.updateSlot(request.getSlotNumber(), request.getStatus());
        return ResponseEntity.ok("Slot updated successfully");
    }

    // Get all slots
    @GetMapping
    public ResponseEntity<List<ParkingSlot>> getAllSlots() {
        return ResponseEntity.ok(service.getAllSlots());
    }

    // Get only free slots
    @GetMapping("/free")
    public ResponseEntity<List<ParkingSlot>> getFreeSlots() {
        return ResponseEntity.ok(service.getFreeSlots());
    }

    // Get a specific slot by number
    @GetMapping("/{slotNumber}")
    public ResponseEntity<ParkingSlot> getSlot(@PathVariable int slotNumber) {
        return ResponseEntity.ok(service.getSlot(slotNumber));
    }

    // Get count of slots by status — useful for dashboard
    @GetMapping("/count/{status}")
    public ResponseEntity<Long> getCountByStatus(@PathVariable ParkingSlot.Status status) {
        return ResponseEntity.ok(service.countByStatus(status));
    }
}
