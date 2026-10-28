
package com.rentease.controller;

import com.rentease.dto.PageResponse;
import com.rentease.dto.PropertyDtos.PropertyResponse;
import com.rentease.entity.PropertyType;
import com.rentease.service.PropertyService;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService properties;

    public PropertyController(PropertyService properties) {
        this.properties = properties;
    }

    @GetMapping
    public PageResponse<PropertyResponse> search(
        @RequestParam(required = false) String location,
        @RequestParam(required = false) BigDecimal minRent,
        @RequestParam(required = false) BigDecimal maxRent,
        @RequestParam(required = false) PropertyType type,
        @RequestParam(required = false) String occupancy,
        @RequestParam(required = false) List<String> amenities,
        @RequestParam(defaultValue = "true") boolean availableOnly,
        @RequestParam(required = false) Double latitude,
        @RequestParam(required = false) Double longitude,
        @RequestParam(required = false) Double radiusKm,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "newest") String sort
    ) {
        return properties.search(
            location,
            minRent,
            maxRent,
            type,
            occupancy,
            amenities,
            availableOnly,
            latitude,
            longitude,
            radiusKm,
            page,
            size,
            sort
        );
    }

    @GetMapping("/featured")
    public List<PropertyResponse> featured() {
        return properties.featured();
    }

    @GetMapping("/{id}")
    public PropertyResponse get(@PathVariable Long id) {
        return properties.getPublic(id);
    }
}
