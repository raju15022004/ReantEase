package com.rentease.service;

import com.rentease.dto.AuthDtos.*;
import com.rentease.entity.Role;
import com.rentease.entity.User;
import com.rentease.exception.BusinessException;
import com.rentease.exception.ResourceNotFoundException;
import com.rentease.repository.UserRepository;
import com.rentease.security.JwtService;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (users.existsByEmail(email)) throw new BusinessException(HttpStatus.CONFLICT, "An account with this email already exists");
        Role role = request.role() == null ? Role.STUDENT : request.role();
        if (role == Role.ADMIN) throw new BusinessException(HttpStatus.BAD_REQUEST, "Admin accounts cannot be registered publicly");
        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPhone(request.phone());
        user.setRole(role);
        user.setPasswordHash(encoder.encode(request.password()));
        return response(users.save(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = users.findByEmail(request.email().trim().toLowerCase(Locale.ROOT))
            .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        if (!user.isEnabled() || !encoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        return response(user);
    }

    @Transactional(readOnly = true)
    public UserResponse me(String email) {
        User user = users.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole());
    }

    private AuthResponse response(User user) {
        return new AuthResponse(jwt.createToken(user), "Bearer", jwt.getExpirationMs(),
            new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole()));
    }
}
