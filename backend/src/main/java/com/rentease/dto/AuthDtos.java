package com.rentease.dto;

import com.rentease.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {}
    public record RegisterRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Email @Size(max = 190) String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @Pattern(regexp = "^$|^[+0-9() .-]{7,30}$") String phone,
        Role role
    ) {}
    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    public record UserResponse(Long id, String name, String email, String phone, Role role) {}
    public record AuthResponse(String token, String tokenType, long expiresIn, UserResponse user) {}
}
