package com.rentease.security;

import com.rentease.entity.User;
import com.rentease.exception.ResourceNotFoundException;
import com.rentease.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {
    private final UserRepository users;
    public CurrentUser(UserRepository users) { this.users = users; }
    public User require(Authentication authentication) {
        return users.findByEmail(authentication.getName())
            .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
    }
}
