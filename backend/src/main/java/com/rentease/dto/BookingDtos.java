package com.rentease.dto;

import com.rentease.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;

public final class BookingDtos {
    private BookingDtos() {}
    public record CreateRequest(@NotNull @jakarta.validation.constraints.FutureOrPresent LocalDate moveInDate,
                                @Size(max = 2000) String message) {}
    public record StatusRequest(@NotNull BookingStatus status) {}
    public record BookingResponse(
        Long id, Long propertyId, String propertyTitle, String city, String locality,
        Long studentId, String studentName, String studentEmail, LocalDate moveInDate,
        String message, BookingStatus status, Instant createdAt
    ) {}
}
