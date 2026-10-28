package com.rentease.service;

import com.rentease.dto.BookingDtos.*;
import com.rentease.dto.PageResponse;
import com.rentease.entity.*;
import com.rentease.exception.BusinessException;
import com.rentease.exception.ResourceNotFoundException;
import com.rentease.repository.BookingRepository;
import com.rentease.repository.PropertyRepository;
import com.rentease.repository.UserRepository;
import java.time.LocalDate;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {
    private final BookingRepository bookings;
    private final PropertyRepository properties;
    private final UserRepository users;

    public BookingService(BookingRepository bookings, PropertyRepository properties, UserRepository users) {
        this.bookings = bookings;
        this.properties = properties;
        this.users = users;
    }

    @Transactional
    public BookingResponse create(Long propertyId, CreateRequest request, String email) {
        User student = user(email);
        Property property = properties.findByIdForUpdate(propertyId)
            .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        if (!property.isActive() || property.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new BusinessException(HttpStatus.CONFLICT, "This property is not available for booking");
        }
        if (property.getOwner().getId().equals(student.getId())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "You cannot request your own property");
        }
        if (request.moveInDate().isBefore(LocalDate.now()) || request.moveInDate().isBefore(property.getAvailableFrom())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Move-in date must be today or later and not before availability");
        }
        if (property.getAvailableRooms() <= 0) {
            throw new BusinessException(HttpStatus.CONFLICT, "No rooms are currently available");
        }
        Booking booking = new Booking();
        booking.setProperty(property);
        booking.setStudent(student);
        booking.setMoveInDate(request.moveInDate());
        booking.setMessage(request.message());
        return response(bookings.save(booking));
    }

    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> studentBookings(String email, int page, int size) {
        User student = user(email);
        var pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 50), Sort.by("createdAt").descending());
        return PageResponse.from(bookings.findByStudentId(student.getId(), pageable).map(this::response));
    }

    @Transactional
    public BookingResponse cancel(Long id, String email) {
        User student = user(email);
        Booking booking = bookings.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getStudent().getId().equals(student.getId())) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "You cannot manage another student's booking");
        }
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BusinessException(HttpStatus.CONFLICT, "Only pending booking requests can be cancelled");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return response(booking);
    }

    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> ownerBookings(String email, int page, int size) {
        User owner = user(email);
        var pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 50), Sort.by("createdAt").descending());
        return PageResponse.from(bookings.findByPropertyOwnerId(owner.getId(), pageable).map(this::response));
    }

    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> adminBookings(int page, int size) {
        var pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), Sort.by("createdAt").descending());
        return PageResponse.from(bookings.findAll(pageable).map(this::response));
    }

    @Transactional
    public BookingResponse updateStatus(Long id, BookingStatus status, String email) {
        User owner = user(email);
        Booking booking = bookings.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getProperty().getOwner().getId().equals(owner.getId())) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "You can manage requests only for your properties");
        }
        if (booking.getStatus() != BookingStatus.PENDING ||
            (status != BookingStatus.ACCEPTED && status != BookingStatus.REJECTED)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Only pending requests can be accepted or rejected");
        }
        if (status == BookingStatus.ACCEPTED) {
            Property locked = properties.findByIdForUpdate(booking.getProperty().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
            long accepted = bookings.countByPropertyIdAndStatus(locked.getId(), BookingStatus.ACCEPTED);
            if (!locked.isActive() || locked.getApprovalStatus() != ApprovalStatus.APPROVED ||
                accepted >= locked.getAvailableRooms()) {
                throw new BusinessException(HttpStatus.CONFLICT, "The property has no remaining booking capacity");
            }
        }
        booking.setStatus(status);
        return response(booking);
    }

    private User user(String email) {
        return users.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Account not found"));
    }

    private BookingResponse response(Booking b) {
        return new BookingResponse(b.getId(), b.getProperty().getId(), b.getProperty().getTitle(),
            b.getProperty().getCity(), b.getProperty().getLocality(), b.getStudent().getId(),
            b.getStudent().getName(), b.getStudent().getEmail(), b.getMoveInDate(), b.getMessage(),
            b.getStatus(), b.getCreatedAt());
    }
}
