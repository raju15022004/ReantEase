
package com.rentease.service;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rentease.dto.PageResponse;
import com.rentease.dto.PropertyDtos.*;
import com.rentease.dto.PropertyDtos.AvailabilityRequest;
import com.rentease.dto.PropertyDtos.OwnerSummary;
import com.rentease.dto.PropertyDtos.PropertyRequest;
import com.rentease.dto.PropertyDtos.PropertyResponse;
import com.rentease.entity.Amenity;
import com.rentease.entity.ApprovalStatus;
import com.rentease.entity.Property;
import com.rentease.entity.PropertyImage;
import com.rentease.entity.PropertyType;
import com.rentease.entity.User;
import com.rentease.exception.BusinessException;
import com.rentease.exception.ResourceNotFoundException;
import com.rentease.repository.AmenityRepository;
import com.rentease.repository.PropertyRepository;
import com.rentease.repository.UserRepository;

@Service
public class PropertyService {

    private final PropertyRepository properties;
    private final UserRepository users;
    private final AmenityRepository amenities;

    public PropertyService(
        PropertyRepository properties,
        UserRepository users,
        AmenityRepository amenities
    ) {
        this.properties = properties;
        this.users = users;
        this.amenities = amenities;
    }

    // Search properties with location, rent, type, amenities and radius
    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> search(
        String location,
        java.math.BigDecimal minRent,
        java.math.BigDecimal maxRent,
        PropertyType type,
        String occupancy,
        List<String> amenityNames,
        boolean availableOnly,
        Double latitude,
        Double longitude,
        Double radiusKm,
        int page,
        int size,
        String sort
    ) {
        if (minRent != null && maxRent != null
                && minRent.compareTo(maxRent) > 0) {
            throw new BusinessException(
                HttpStatus.BAD_REQUEST,
                "Minimum rent cannot exceed maximum rent"
            );
        }

        boolean hasLatitude = latitude != null;
        boolean hasLongitude = longitude != null;

        if (hasLatitude != hasLongitude) {
            throw new BusinessException(
                HttpStatus.BAD_REQUEST,
                "Latitude and longitude must be provided together"
            );
        }

        if (radiusKm != null && !hasLatitude) {
            throw new BusinessException(
                HttpStatus.BAD_REQUEST,
                "Latitude and longitude are required for nearby search"
            );
        }

        if (hasLatitude && (
                !Double.isFinite(latitude)
                || !Double.isFinite(longitude)
                || latitude < -90 || latitude > 90
                || longitude < -180 || longitude > 180
        )) {
            throw new BusinessException(
                HttpStatus.BAD_REQUEST,
                "Invalid latitude or longitude"
            );
        }

        if (radiusKm != null && (
                !Double.isFinite(radiusKm)
                || radiusKm <= 0
                || radiusKm > 100
        )) {
            throw new BusinessException(
                HttpStatus.BAD_REQUEST,
                "Radius must be greater than 0 and at most 100 km"
            );
        }

        Sort order = switch (sort == null ? "newest" : sort) {
            case "rent_asc" ->
                Sort.by("monthlyRent").ascending();

            case "rent_desc" ->
                Sort.by("monthlyRent").descending();

            case "newest" ->
                Sort.by("createdAt").descending();

            default -> throw new BusinessException(
                HttpStatus.BAD_REQUEST,
                "Unsupported sort order"
            );
        };

        int safePage = Math.max(0, page);
        int pageSize = Math.min(Math.max(1, size), 50);

        Pageable pageable = PageRequest.of(
            safePage,
            pageSize,
            order
        );

        // Only approved and active properties are public
        Specification<Property> spec = (root, query, cb) ->
            cb.and(
                cb.equal(
                    root.get("approvalStatus"),
                    ApprovalStatus.APPROVED
                ),
                cb.isTrue(root.get("active"))
            );

        // Filter by city or locality
        if (location != null && !location.isBlank()) {
            String match =
                "%" + location.trim().toLowerCase(Locale.ROOT) + "%";

            spec = spec.and((root, query, cb) ->
                cb.or(
                    cb.like(cb.lower(root.get("city")), match),
                    cb.like(cb.lower(root.get("locality")), match)
                )
            );
        }

        // Minimum rent
        if (minRent != null) {
            spec = spec.and((root, query, cb) ->
                cb.greaterThanOrEqualTo(
                    root.get("monthlyRent"),
                    minRent
                )
            );
        }

        // Maximum rent
        if (maxRent != null) {
            spec = spec.and((root, query, cb) ->
                cb.lessThanOrEqualTo(
                    root.get("monthlyRent"),
                    maxRent
                )
            );
        }

        // PG, ROOM or FLAT
        if (type != null) {
            spec = spec.and((root, query, cb) ->
                cb.equal(root.get("propertyType"), type)
            );
        }

        // Single/shared occupancy
        if (occupancy != null && !occupancy.isBlank()) {
            String occupancyValue =
                occupancy.trim().toLowerCase(Locale.ROOT);

            spec = spec.and((root, query, cb) ->
                cb.equal(
                    cb.lower(root.get("occupancyType")),
                    occupancyValue
                )
            );
        }

        // Only properties with available rooms
        if (availableOnly) {
            spec = spec.and((root, query, cb) ->
                cb.greaterThan(root.get("availableRooms"), 0)
            );
        }

        // Filter by amenities such as AC, Wi-Fi and furnished
        if (amenityNames != null && !amenityNames.isEmpty()) {
            Set<String> filters = amenityNames.stream()
                .filter(a -> a != null && !a.isBlank())
                .map(a -> a.trim().toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());

            if (!filters.isEmpty()) {
                spec = spec.and((root, query, cb) -> {
                    var join = root.join("amenities");
                    query.distinct(true);
                    return cb.lower(join.get("name")).in(filters);
                });
            }
        }

        // Normal search: use database pagination
        if (radiusKm == null) {
            Page<PropertyResponse> result =
                properties.findAll(spec, pageable)
                    .map(this::toResponse);

            return PageResponse.from(result);
        }

        // Nearby search: find matching properties and calculate distance
        List<Property> nearby = properties.findAll(spec, order)
            .stream()
            .filter(property ->
                property.getLatitude() != null
                && property.getLongitude() != null
            )
            .filter(property -> {
                double propertyLat =
                    property.getLatitude().doubleValue();

                double propertyLon =
                    property.getLongitude().doubleValue();

                // Ignore default coordinates (0, 0)
                if (propertyLat == 0.0 && propertyLon == 0.0) {
                    return false;
                }

                double distance = distanceKm(
                    latitude,
                    longitude,
                    propertyLat,
                    propertyLon
                );

                return distance <= radiusKm;
            })
            .toList();

        // Apply pagination after radius filtering
        int start = (int) Math.min(
            (long) safePage * pageSize,
            nearby.size()
        );

        int end = Math.min(start + pageSize, nearby.size());

        List<PropertyResponse> content = nearby
            .subList(start, end)
            .stream()
            .map(this::toResponse)
            .toList();

        Page<PropertyResponse> result =
            new org.springframework.data.domain.PageImpl<>(
                content,
                pageable,
                nearby.size()
            );

        return PageResponse.from(result);
    }

    // Calculate distance between two coordinates using Haversine formula
    private double distanceKm(
        double lat1,
        double lon1,
        double lat2,
        double lon2
    ) {
        double earthRadiusKm = 6371.0;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(Math.toRadians(lat1))
            * Math.cos(Math.toRadians(lat2))
            * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

        return earthRadiusKm * c;
    }

    @Transactional(readOnly = true)
    public PropertyResponse getPublic(Long id) {
        Property property = properties.findById(id)
            .filter(p ->
                p.isActive()
                && p.getApprovalStatus() == ApprovalStatus.APPROVED
            )
            .orElseThrow(() ->
                new ResourceNotFoundException("Property not found")
            );

        return toResponse(property);
    }

    @Transactional(readOnly = true)
    public PropertyResponse getOwned(Long id, String email) {
        return toResponse(owned(id, email));
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> featured() {
        return properties
            .findTop6ByApprovalStatusAndActiveTrueOrderByCreatedAtDesc(
                ApprovalStatus.APPROVED
            )
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public PropertyResponse create(PropertyRequest request, String email) {
        Property property = new Property();

        property.setOwner(user(email));
        apply(property, request);
        property.setApprovalStatus(ApprovalStatus.PENDING);
        property.setActive(true);

        properties.save(property);
        property.replaceImages(images(property, request.imageUrls()));

        return toResponse(properties.save(property));
    }

    @Transactional
    public PropertyResponse update(
        Long id,
        PropertyRequest request,
        String email
    ) {
        Property property = owned(id, email);

        apply(property, request);
        property.setApprovalStatus(ApprovalStatus.PENDING);
        property.setActive(true);

        property.replaceImages(images(property, request.imageUrls()));

        return toResponse(properties.save(property));
    }

    @Transactional
    public void deactivate(Long id, String email) {
        Property property = owned(id, email);
        property.setActive(false);
    }

    @Transactional
    public PropertyResponse availability(
        Long id,
        AvailabilityRequest request,
        String email
    ) {
        Property property = owned(id, email);

        property.setAvailableRooms(request.availableRooms());
        property.setActive(request.active());

        return toResponse(property);
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> ownerProperties(
        String email,
        int page,
        int size
    ) {
        Pageable pageable = PageRequest.of(
            Math.max(0, page),
            Math.min(Math.max(1, size), 50),
            Sort.by("createdAt").descending()
        );

        return PageResponse.from(
            properties.findByOwnerId(user(email).getId(), pageable)
                .map(this::toResponse)
        );
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> adminProperties(
        ApprovalStatus status,
        int page,
        int size
    ) {
        Pageable pageable = PageRequest.of(
            Math.max(0, page),
            Math.min(Math.max(1, size), 50),
            Sort.by("createdAt").descending()
        );

        Page<Property> result = status == null
            ? properties.findAll(pageable)
            : properties.findByApprovalStatus(status, pageable);

        return PageResponse.from(result.map(this::toResponse));
    }

    @Transactional
    public PropertyResponse approve(Long id, ApprovalStatus status) {
        Property property = properties.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("Property not found")
            );

        property.setApprovalStatus(status);
        property.setActive(status == ApprovalStatus.APPROVED);

        return toResponse(property);
    }

    private void apply(Property p, PropertyRequest r) {
        p.setTitle(r.title().trim());
        p.setDescription(r.description().trim());
        p.setPropertyType(r.propertyType());
        p.setMonthlyRent(r.monthlyRent());
        p.setSecurityDeposit(r.securityDeposit());
        p.setCity(r.city().trim());
        p.setLocality(r.locality().trim());
        p.setFullAddress(r.fullAddress().trim());
        p.setLatitude(r.latitude());
        p.setLongitude(r.longitude());
        p.setOccupancyType(r.occupancyType());
        p.setAvailableRooms(r.availableRooms());
        p.setAvailableFrom(r.availableFrom());
        p.setHouseRules(r.houseRules());

        Set<Amenity> values = r.amenities() == null
            ? Set.of()
            : r.amenities().stream()
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(name ->
                    amenities.findByNameIgnoreCase(name)
                        .orElseGet(() ->
                            amenities.save(new Amenity(name))
                        )
                )
                .collect(Collectors.toSet());

        p.setAmenities(values);
    }

    private List<PropertyImage> images(
        Property property,
        List<String> urls
    ) {
        if (urls == null) {
            return new ArrayList<>();
        }

        List<PropertyImage> result = new ArrayList<>();

        for (int i = 0; i < urls.size(); i++) {
            String value = urls.get(i).trim();

            try {
                String scheme = URI.create(value).getScheme();

                if (!"https".equalsIgnoreCase(scheme)
                        && !"http".equalsIgnoreCase(scheme)) {
                    throw new IllegalArgumentException();
                }
            } catch (IllegalArgumentException ex) {
                throw new BusinessException(
                    HttpStatus.BAD_REQUEST,
                    "Property image URLs must be valid HTTP or HTTPS URLs"
                );
            }

            result.add(
                new PropertyImage(property, value, i == 0, i)
            );
        }

        return result;
    }

    private User user(String email) {
        return users.findByEmail(email)
            .orElseThrow(() ->
                new ResourceNotFoundException("Account not found")
            );
    }

    private Property owned(Long id, String email) {
        Property property = properties.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("Property not found")
            );

        if (!property.getOwner().getEmail().equalsIgnoreCase(email)) {
            throw new BusinessException(
                HttpStatus.FORBIDDEN,
                "You do not own this property"
            );
        }

        return property;
    }

    public PropertyResponse toResponse(Property p) {
        return new PropertyResponse(
            p.getId(),
            p.getTitle(),
            p.getDescription(),
            p.getPropertyType().name(),
            p.getMonthlyRent(),
            p.getSecurityDeposit(),
            p.getCity(),
            p.getLocality(),
            p.getFullAddress(),
            p.getLatitude(),
            p.getLongitude(),
            p.getOccupancyType(),
            p.getAvailableRooms(),
            p.getAvailableFrom(),
            p.getHouseRules(),
            p.getApprovalStatus().name(),
            p.isActive(),
            p.getAmenities().stream()
                .map(Amenity::getName)
                .sorted()
                .toList(),
            p.getImages().stream()
                .map(PropertyImage::getImageUrl)
                .toList(),
            new OwnerSummary(
                p.getOwner().getId(),
                p.getOwner().getName()
            ),
            p.getCreatedAt()
        );
    }
}
