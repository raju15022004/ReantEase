package com.rentease.controller;

import com.rentease.dto.AdminDtos.*;
import com.rentease.dto.PageResponse;
import com.rentease.dto.PropertyDtos.*;
import com.rentease.dto.BookingDtos.BookingResponse;
import com.rentease.dto.ReportDtos;
import com.rentease.entity.ApprovalStatus;
import com.rentease.entity.Role;
import com.rentease.service.AdminService;
import com.rentease.service.BookingService;
import com.rentease.service.PropertyService;
import com.rentease.service.PropertyReportService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService admin;
    private final PropertyService properties;
    private final BookingService bookings;
    private final PropertyReportService reports;
    public AdminController(AdminService admin, PropertyService properties, BookingService bookings,
                           PropertyReportService reports) {
        this.admin = admin;
        this.properties = properties;
        this.bookings = bookings;
        this.reports = reports;
    }

    @GetMapping("/users")
    public PageResponse<UserResponse> users(@RequestParam(required = false) Role role,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return admin.users(role, page, size);
    }

    @GetMapping("/properties")
    public PageResponse<PropertyResponse> properties(@RequestParam(required = false) ApprovalStatus status,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return properties.adminProperties(status, page, size);
    }

    @PatchMapping("/properties/{id}/approval")
    public PropertyResponse approve(@PathVariable Long id, @Valid @RequestBody ApprovalRequest request) {
        return properties.approve(id, request.status());
    }

    @PatchMapping("/users/{id}/status")
    public UserResponse status(@PathVariable Long id, @Valid @RequestBody UserStatusRequest request) {
        return admin.setEnabled(id, request.enabled());
    }

    @GetMapping("/dashboard")
    public Map<String, Long> dashboard() { return admin.dashboard(); }

    @GetMapping("/bookings")
    public PageResponse<BookingResponse> bookings(
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return bookings.adminBookings(page, size);
    }

    @GetMapping("/reports")
    public PageResponse<ReportDtos.Response> reports(@RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {
        return reports.list(page, size);
    }

    @PatchMapping("/reports/{id}")
    public ReportDtos.Response updateReport(@PathVariable Long id, @Valid @RequestBody ReportDtos.StatusRequest request) {
        return reports.update(id, request);
    }
}
