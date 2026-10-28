package com.rentease.service;

import com.rentease.dto.PageResponse;
import com.rentease.dto.ReportDtos.*;
import com.rentease.entity.PropertyReport;
import com.rentease.exception.BusinessException;
import com.rentease.exception.ResourceNotFoundException;
import com.rentease.repository.PropertyReportRepository;
import com.rentease.repository.PropertyRepository;
import com.rentease.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PropertyReportService {
    private final PropertyReportRepository reports;
    private final PropertyRepository properties;
    private final UserRepository users;

    public PropertyReportService(PropertyReportRepository reports, PropertyRepository properties, UserRepository users) {
        this.reports = reports;
        this.properties = properties;
        this.users = users;
    }

    @Transactional
    public Response create(Long propertyId, CreateRequest request, String email) {
        var property = properties.findById(propertyId)
            .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        var reporter = users.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        PropertyReport report = new PropertyReport();
        report.setProperty(property);
        report.setReporter(reporter);
        report.setReason(request.reason().trim());
        report.setDetails(request.details());
        return response(reports.save(report));
    }

    @Transactional(readOnly = true)
    public PageResponse<Response> list(int page, int size) {
        var pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), Sort.by("createdAt").descending());
        return PageResponse.from(reports.findAllByOrderByCreatedAtDesc(pageable).map(this::response));
    }

    @Transactional
    public Response update(Long id, StatusRequest request) {
        String status = request.status().toUpperCase(java.util.Locale.ROOT);
        if (!java.util.Set.of("OPEN", "REVIEWED", "DISMISSED").contains(status)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Report status must be OPEN, REVIEWED, or DISMISSED");
        }
        var report = reports.findById(id).orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        report.setStatus(status);
        return response(report);
    }

    private Response response(PropertyReport report) {
        return new Response(report.getId(), report.getProperty().getId(), report.getProperty().getTitle(),
            report.getReporter().getId(), report.getReason(), report.getDetails(),
            report.getStatus(), report.getCreatedAt());
    }
}
