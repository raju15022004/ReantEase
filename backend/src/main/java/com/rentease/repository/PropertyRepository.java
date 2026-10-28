package com.rentease.repository;

import com.rentease.entity.ApprovalStatus;
import com.rentease.entity.Property;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
    Page<Property> findByOwnerId(Long ownerId, Pageable pageable);
    Page<Property> findByApprovalStatus(ApprovalStatus status, Pageable pageable);
    List<Property> findTop6ByApprovalStatusAndActiveTrueOrderByCreatedAtDesc(ApprovalStatus status);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Property p where p.id = :id")
    Optional<Property> findByIdForUpdate(@Param("id") Long id);
}
