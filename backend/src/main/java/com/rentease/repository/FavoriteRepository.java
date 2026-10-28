package com.rentease.repository;

import com.rentease.entity.Favorite;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByStudentIdOrderByIdDesc(Long studentId);
    Optional<Favorite> findByStudentIdAndPropertyId(Long studentId, Long propertyId);
    boolean existsByStudentIdAndPropertyId(Long studentId, Long propertyId);
}
