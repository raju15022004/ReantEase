package com.rentease.repository;

import com.rentease.entity.PropertyReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyReportRepository extends JpaRepository<PropertyReport, Long> {
    Page<PropertyReport> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
