package com.rentease.service;

import com.rentease.entity.Role;
import com.rentease.entity.User;
import com.rentease.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrap implements CommandLineRunner {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final String email;
    private final String password;

    public AdminBootstrap(UserRepository users, PasswordEncoder encoder,
        @Value("${rentease.admin.email}") String email, @Value("${rentease.admin.password}") String password) {
        this.users = users;
        this.encoder = encoder;
        this.email = email;
        this.password = password;
    }

    @Override
    public void run(String... args) {
        if (email.isBlank() && password.isBlank()) return;
        if (email.isBlank() || password.length() < 12) {
            throw new IllegalStateException("Set both admin email and an admin password of at least 12 characters");
        }
        if (!users.existsByEmail(email)) {
            User admin = new User();
            admin.setName("RentEase Administrator");
            admin.setEmail(email);
            admin.setPasswordHash(encoder.encode(password));
            admin.setRole(Role.ADMIN);
            users.save(admin);
        }
    }
}
