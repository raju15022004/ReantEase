package com.rentease.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.rentease.entity.*;
import com.rentease.exception.BusinessException;
import com.rentease.repository.BookingRepository;
import com.rentease.repository.PropertyRepository;
import com.rentease.repository.UserRepository;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {
    @Mock BookingRepository bookings;
    @Mock PropertyRepository properties;
    @Mock UserRepository users;
    private BookingService service;

    @BeforeEach
    void setUp() { service = new BookingService(bookings, properties, users); }

    @Test
    void ownerCannotAcceptBeyondRoomCapacity() {
        User owner = user(8L, "owner@example.test");
        User student = user(9L, "student@example.test");
        Property property = new Property();
        property.setOwner(owner);
        property.setApprovalStatus(ApprovalStatus.APPROVED);
        property.setAvailableRooms(1);
        ReflectionTestUtils.setField(property, "id", 31L);
        Booking booking = new Booking();
        booking.setProperty(property);
        booking.setStudent(student);
        booking.setMoveInDate(LocalDate.now().plusDays(10));
        when(users.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(bookings.findById(4L)).thenReturn(Optional.of(booking));
        when(properties.findByIdForUpdate(31L)).thenReturn(Optional.of(property));
        when(bookings.countByPropertyIdAndStatus(31L, BookingStatus.ACCEPTED)).thenReturn(1L);

        BusinessException error = assertThrows(BusinessException.class,
            () -> service.updateStatus(4L, BookingStatus.ACCEPTED, owner.getEmail()));

        assertEquals(409, error.getStatus().value());
        assertEquals(BookingStatus.PENDING, booking.getStatus());
        verify(bookings, never()).save(any());
    }

    @Test
    void studentCannotCancelAnotherStudentsBooking() {
        User current = user(10L, "current@example.test");
        User otherStudent = user(11L, "other@example.test");
        Booking booking = new Booking();
        booking.setStudent(otherStudent);
        booking.setStatus(BookingStatus.PENDING);
        when(users.findByEmail(current.getEmail())).thenReturn(Optional.of(current));
        when(bookings.findById(5L)).thenReturn(Optional.of(booking));

        BusinessException error = assertThrows(BusinessException.class,
            () -> service.cancel(5L, current.getEmail()));

        assertEquals(403, error.getStatus().value());
        assertEquals(BookingStatus.PENDING, booking.getStatus());
    }

    @Test
    void studentCanCreatePendingRequestForApprovedAvailableProperty() {
        User owner = user(20L, "owner@example.test");
        User student = user(21L, "student@example.test");
        Property property = new Property();
        property.setOwner(owner);
        property.setApprovalStatus(ApprovalStatus.APPROVED);
        property.setAvailableRooms(2);
        property.setAvailableFrom(LocalDate.now());
        ReflectionTestUtils.setField(property, "id", 44L);
        when(users.findByEmail(student.getEmail())).thenReturn(Optional.of(student));
        when(properties.findByIdForUpdate(44L)).thenReturn(Optional.of(property));
        when(bookings.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = service.create(44L,
            new com.rentease.dto.BookingDtos.CreateRequest(LocalDate.now().plusDays(7), "Please share details."),
            student.getEmail());

        assertEquals(BookingStatus.PENDING, result.status());
        assertEquals(44L, result.propertyId());
        verify(bookings).save(any(Booking.class));
    }

    @Test
    void ownerCanRejectPendingRequestForTheirProperty() {
        User owner = user(30L, "owner@example.test");
        User student = user(31L, "student@example.test");
        Property property = new Property();
        property.setOwner(owner);
        ReflectionTestUtils.setField(property, "id", 45L);
        Booking booking = new Booking();
        booking.setProperty(property);
        booking.setStudent(student);
        booking.setMoveInDate(LocalDate.now().plusDays(5));
        when(users.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(bookings.findById(6L)).thenReturn(Optional.of(booking));

        var result = service.updateStatus(6L, BookingStatus.REJECTED, owner.getEmail());

        assertEquals(BookingStatus.REJECTED, result.status());
    }

    private User user(Long id, String email) {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", id);
        user.setEmail(email);
        user.setName(email);
        return user;
    }
}
