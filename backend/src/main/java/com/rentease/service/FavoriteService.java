package com.rentease.service;

import com.rentease.dto.PropertyDtos.PropertyResponse;
import com.rentease.entity.ApprovalStatus;
import com.rentease.entity.Favorite;
import com.rentease.entity.User;
import com.rentease.exception.ResourceNotFoundException;
import com.rentease.repository.FavoriteRepository;
import com.rentease.repository.PropertyRepository;
import com.rentease.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {
    private final FavoriteRepository favorites;
    private final PropertyRepository properties;
    private final UserRepository users;
    private final PropertyService propertyService;

    public FavoriteService(FavoriteRepository favorites, PropertyRepository properties, UserRepository users,
                           PropertyService propertyService) {
        this.favorites = favorites;
        this.properties = properties;
        this.users = users;
        this.propertyService = propertyService;
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> list(String email) {
        User student = user(email);
        return favorites.findByStudentIdOrderByIdDesc(student.getId()).stream()
            .map(Favorite::getProperty)
            .filter(p -> p.isActive() && p.getApprovalStatus() == ApprovalStatus.APPROVED)
            .map(propertyService::toResponse).toList();
    }

    @Transactional
    public void add(String email, Long propertyId) {
        User student = user(email);
        var property = properties.findById(propertyId)
            .filter(p -> p.isActive() && p.getApprovalStatus() == ApprovalStatus.APPROVED)
            .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        if (!favorites.existsByStudentIdAndPropertyId(student.getId(), propertyId)) {
            favorites.save(new Favorite(student, property));
        }
    }

    @Transactional
    public void remove(String email, Long propertyId) {
        User student = user(email);
        favorites.findByStudentIdAndPropertyId(student.getId(), propertyId).ifPresent(favorites::delete);
    }

    private User user(String email) {
        return users.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Account not found"));
    }
}
