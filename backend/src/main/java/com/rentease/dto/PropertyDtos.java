package com.rentease.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import com.rentease.entity.ApprovalStatus;
import com.rentease.entity.PropertyType;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class PropertyDtos {
    private PropertyDtos() {}
    public record PropertyRequest(
        @NotBlank @Size(max = 180) String title,
        @NotBlank @Size(max = 5000) String description,
        @NotNull PropertyType propertyType,
        @NotNull @DecimalMin("0.00") @Digits(integer = 8, fraction = 2) BigDecimal monthlyRent,
        @NotNull @DecimalMin("0.00") @Digits(integer = 8, fraction = 2) BigDecimal securityDeposit,
        @NotBlank @Size(max = 100) String city,
        @NotBlank @Size(max = 120) String locality,
        @NotBlank @Size(max = 500) String fullAddress,
        @DecimalMin("-90.0") @DecimalMax("90.0") BigDecimal latitude,
        @DecimalMin("-180.0") @DecimalMax("180.0") BigDecimal longitude,
        @Size(max = 40) String occupancyType,
        @NotNull @Min(0) @Max(100) Integer availableRooms,
        @NotNull @FutureOrPresent LocalDate availableFrom,
        @Size(max = 2000) String houseRules,
        @Size(max = 20) List<@NotBlank @Size(max = 1000) String> imageUrls,
        @Size(max = 30) List<@NotBlank @Size(max = 60) String> amenities
    ) {}
    public record OwnerSummary(Long id, String name) {}
    public record PropertyResponse(
        Long id, String title, String description, String propertyType, BigDecimal monthlyRent,
        BigDecimal securityDeposit, String city, String locality, String fullAddress,
        BigDecimal latitude, BigDecimal longitude, String occupancyType, int availableRooms,
        LocalDate availableFrom, String houseRules, String approvalStatus, boolean active,
        List<String> amenities, List<String> imageUrls, OwnerSummary owner, Instant createdAt
    ) {}
    public record ApprovalRequest(@NotNull ApprovalStatus status) {}
    public record AvailabilityRequest(@NotNull @Min(0) @Max(100) Integer availableRooms,
                                      @NotNull Boolean active) {}
}
