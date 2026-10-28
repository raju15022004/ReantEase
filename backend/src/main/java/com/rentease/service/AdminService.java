package com.rentease.service;

import com.rentease.dto.AdminDtos.*;
import com.rentease.dto.PageResponse;
import com.rentease.entity.Role;
import com.rentease.exception.BusinessException;
import com.rentease.exception.ResourceNotFoundException;
import com.rentease.repository.BookingRepository;
import com.rentease.repository.PropertyRepository;
import com.rentease.repository.UserRepository;
import java.util.Map;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {
    private final UserRepository users;
    private final PropertyRepository properties;
    private final BookingRepository bookings;

    public AdminService(UserRepository users, PropertyRepository properties, BookingRepository bookings) {
        this.users = users;
        this.properties = properties;
        this.bookings = bookings;
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> users(Role role, int page, int size) {
        var pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), Sort.by("createdAt").descending());
        var result = role == null ? users.findAll(pageable) : users.findByRole(role, pageable);
        return PageResponse.from(result.map(u -> new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getPhone(),
            u.getRole(), u.isEnabled(), u.getCreatedAt())));
    }

    @Transactional
    public UserResponse setEnabled(Long id, boolean enabled) {
        var user = users.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() == Role.ADMIN && !enabled) {
            throw new BusinessException(HttpStatus.CONFLICT, "Admin accounts cannot be disabled using this endpoint");
        }
        user.setEnabled(enabled);
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getPhone(),
            user.getRole(), user.isEnabled(), user.getCreatedAt());
    }

    @Transactional(readOnly = true)
    public Map<String, Long> dashboard() {
        return Map.of("users", users.count(), "properties", properties.count(),
            "pendingProperties", properties.findByApprovalStatus(com.rentease.entity.ApprovalStatus.PENDING,
                PageRequest.of(0, 1)).getTotalElements(),
            "pendingBookings", bookings.countByStatus(com.rentease.entity.BookingStatus.PENDING),
            "acceptedBookings", bookings.countByStatus(com.rentease.entity.BookingStatus.ACCEPTED));
    }
}
