package com.rentease.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.rentease.dto.AuthDtos.RegisterRequest;
import com.rentease.dto.AuthDtos.LoginRequest;
import com.rentease.entity.Role;
import com.rentease.entity.User;
import com.rentease.exception.BusinessException;
import com.rentease.repository.UserRepository;
import com.rentease.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.BadCredentialsException;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock UserRepository users;
    @Mock PasswordEncoder encoder;
    @Mock JwtService jwt;
    private AuthService service;

    @BeforeEach
    void setUp() { service = new AuthService(users, encoder, jwt); }

    @Test
    void registerCreatesStudentAndReturnsBearerToken() {
        when(users.existsByEmail("sam@example.test")).thenReturn(false);
        when(encoder.encode("Passphrase123")).thenReturn("bcrypt-hash");
        when(users.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwt.createToken(any(User.class))).thenReturn("signed-token");
        when(jwt.getExpirationMs()).thenReturn(900_000L);

        var result = service.register(new RegisterRequest("Sam User", " SAM@example.test ",
            "Passphrase123", null, null));

        assertEquals("signed-token", result.token());
        assertEquals("Bearer", result.tokenType());
        assertEquals(Role.STUDENT, result.user().role());
        assertEquals("sam@example.test", result.user().email());
        verify(encoder).encode("Passphrase123");
    }

    @Test
    void registrationCannotCreateAdministrator() {
        when(users.existsByEmail("admin@example.test")).thenReturn(false);
        var request = new RegisterRequest("Admin", "admin@example.test", "Passphrase123", null, Role.ADMIN);

        assertThrows(BusinessException.class, () -> service.register(request));
        verify(users, never()).save(any());
    }

    @Test
    void loginReturnsTokenForCorrectEnabledAccount() {
        User user = new User();
        user.setName("Sam User");
        user.setEmail("sam@example.test");
        user.setPasswordHash("bcrypt-hash");
        user.setRole(Role.STUDENT);
        when(users.findByEmail("sam@example.test")).thenReturn(java.util.Optional.of(user));
        when(encoder.matches("Passphrase123", "bcrypt-hash")).thenReturn(true);
        when(jwt.createToken(user)).thenReturn("signed-token");
        when(jwt.getExpirationMs()).thenReturn(900_000L);

        var result = service.login(new LoginRequest("SAM@example.test", "Passphrase123"));

        assertEquals("signed-token", result.token());
        assertEquals("sam@example.test", result.user().email());
    }

    @Test
    void loginRejectsDisabledAccount() {
        User user = new User();
        user.setEmail("sam@example.test");
        user.setPasswordHash("bcrypt-hash");
        user.setEnabled(false);
        when(users.findByEmail("sam@example.test")).thenReturn(java.util.Optional.of(user));

        assertThrows(BadCredentialsException.class,
            () -> service.login(new LoginRequest("sam@example.test", "Passphrase123")));
        verify(encoder, never()).matches(anyString(), anyString());
    }
}
