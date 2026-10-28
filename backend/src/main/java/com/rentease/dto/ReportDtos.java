package com.rentease.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public final class ReportDtos {
    private ReportDtos() {}
    public record CreateRequest(@NotBlank @Size(max = 80) String reason, @Size(max = 1500) String details) {}
    public record StatusRequest(@NotBlank @Size(max = 20) String status) {}
    public record Response(Long id, Long propertyId, String propertyTitle, Long reporterId,
                           String reason, String details, String status, Instant createdAt) {}
}
