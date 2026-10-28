package com.rentease.controller;

import com.rentease.dto.ReportDtos;
import com.rentease.service.PropertyReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/reports")
public class PropertyReportController {
    private final PropertyReportService reports;
    public PropertyReportController(PropertyReportService reports) { this.reports = reports; }

    @PostMapping("/{propertyId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ReportDtos.Response create(@PathVariable Long propertyId,
        @Valid @RequestBody ReportDtos.CreateRequest request, Authentication auth) {
        return reports.create(propertyId, request, auth.getName());
    }
}
