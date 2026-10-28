package com.rentease.controller;

import com.rentease.dto.PageResponse;
import com.rentease.dto.PropertyDtos.*;
import com.rentease.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner/properties")
public class OwnerPropertyController {
    private final PropertyService properties;
    public OwnerPropertyController(PropertyService properties) { this.properties = properties; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PropertyResponse create(@Valid @RequestBody PropertyRequest request, Authentication auth) {
        return properties.create(request, auth.getName());
    }

    @GetMapping
    public PageResponse<PropertyResponse> list(Authentication auth,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return properties.ownerProperties(auth.getName(), page, size);
    }

    @GetMapping("/{id}")
    public PropertyResponse get(@PathVariable Long id, Authentication auth) {
        return properties.getOwned(id, auth.getName());
    }

    @PutMapping("/{id}")
    public PropertyResponse update(@PathVariable Long id, @Valid @RequestBody PropertyRequest request, Authentication auth) {
        return properties.update(id, request, auth.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication auth) { properties.deactivate(id, auth.getName()); }

    @PatchMapping("/{id}/availability")
    public PropertyResponse availability(@PathVariable Long id, @Valid @RequestBody AvailabilityRequest request,
                                         Authentication auth) {
        return properties.availability(id, request, auth.getName());
    }
}
