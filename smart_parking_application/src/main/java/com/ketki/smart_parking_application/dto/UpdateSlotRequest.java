package com.ketki.smart_parking_application.dto;

import com.ketki.smart_parking_application.entity.ParkingSlot;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateSlotRequest {

    @NotNull(message = "Slot number is required")
    @Min(value = 1, message = "Slot number must be at least 1")
    private Integer slotNumber;

    @NotNull(message = "Status is required")
    private ParkingSlot.Status status;

}
