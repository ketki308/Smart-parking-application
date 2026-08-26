package com.ketki.smart_parking_application.service;

import com.ketki.smart_parking_application.entity.ParkingSlot;
import com.ketki.smart_parking_application.exception.ResourceNotFoundException;
import com.ketki.smart_parking_application.repository.ParkingSlotRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ParkingSlotService {

    private final ParkingSlotRepository repository;

    // Constructor injection — no @Autowired needed
    public ParkingSlotService(ParkingSlotRepository repository) {
        this.repository = repository;
    }

    public void updateSlot(int slotNumber, ParkingSlot.Status status) {
        ParkingSlot slot = repository.findBySlotNumber(slotNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Slot #" + slotNumber + " not found"));

        slot.setStatus(status);
        repository.save(slot);
    }

    public ParkingSlot getSlot(int slotNumber) {
        return repository.findBySlotNumber(slotNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Slot #" + slotNumber + " not found"));
    }

    public List<ParkingSlot> getAllSlots() {
        return repository.findAll();
    }

    public List<ParkingSlot> getFreeSlots() {
        return repository.findByStatus(ParkingSlot.Status.FREE);
    }

    public long countByStatus(ParkingSlot.Status status) {
        return repository.countByStatus(status);
    }
}
