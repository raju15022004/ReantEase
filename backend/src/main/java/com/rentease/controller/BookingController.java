package com.rentease.controller;

import com.rentease.dto.BookingDtos.*;
import com.rentease.dto.PageResponse;
import com.rentease.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
public class BookingController {
    private final BookingService bookings;
    public BookingController(BookingService bookings) { this.bookings = bookings; }

    @PostMapping("/api/properties/{propertyId}/bookings")
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse create(@PathVariable Long propertyId, @Valid @RequestBody CreateRequest request, Authentication auth) {
        return bookings.create(propertyId, request, auth.getName());
    }

    @GetMapping("/api/student/bookings")
    public PageResponse<BookingResponse> student(Authentication auth,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return bookings.studentBookings(auth.getName(), page, size);
    }

    @PatchMapping("/api/student/bookings/{bookingId}/cancel")
    public BookingResponse cancel(@PathVariable Long bookingId, Authentication auth) {
        return bookings.cancel(bookingId, auth.getName());
    }

    @GetMapping("/api/owner/bookings")
    public PageResponse<BookingResponse> owner(Authentication auth,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return bookings.ownerBookings(auth.getName(), page, size);
    }

    @PatchMapping("/api/owner/bookings/{bookingId}/status")
    public BookingResponse update(@PathVariable Long bookingId, @Valid @RequestBody StatusRequest request, Authentication auth) {
        return bookings.updateStatus(bookingId, request.status(), auth.getName());
    }
}
