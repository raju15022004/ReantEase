package com.rentease.repository;

import com.rentease.entity.Amenity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AmenityRepository extends JpaRepository<Amenity, Long> {
    Optional<Amenity> findByNameIgnoreCase(String name);
}
