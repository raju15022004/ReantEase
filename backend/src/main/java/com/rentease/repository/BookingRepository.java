package com.rentease.repository;

import com.rentease.entity.Booking;
import com.rentease.entity.BookingStatus;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByStudentId(Long studentId, Pageable pageable);
    Page<Booking> findByPropertyOwnerId(Long ownerId, Pageable pageable);
    long countByPropertyIdAndStatus(Long propertyId, BookingStatus status);
    long countByStatus(BookingStatus status);
    List<Booking> findTop5ByOrderByCreatedAtDesc();
}
