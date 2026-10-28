package com.rentease.dto;

import com.rentease.entity.Role;
import java.time.Instant;

public final class AdminDtos {
    private AdminDtos() {}
    public record UserResponse(Long id, String name, String email, String phone, Role role, boolean enabled, Instant createdAt) {}
    public record UserStatusRequest(boolean enabled) {}
}
