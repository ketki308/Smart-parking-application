package com.ketki.smart_parking_application.repository;

import com.ketki.smart_parking_application.entity.ParkingSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {

    // Returns Optional — forces caller to handle "not found" safely
    Optional<ParkingSlot> findBySlotNumber(int slotNumber);

    List<ParkingSlot> findByStatus(ParkingSlot.Status status);

    // Useful for duplicate slot number check when adding new slots
    boolean existsBySlotNumber(int slotNumber);

    // Useful for dashboard — count free/occupied slots
    long countByStatus(ParkingSlot.Status status);
}
