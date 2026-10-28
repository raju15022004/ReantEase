
package com.rentease.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.rentease.dto.PropertyDtos.PropertyRequest;
import com.rentease.entity.Property;
import com.rentease.entity.PropertyType;
import com.rentease.entity.User;
import com.rentease.exception.BusinessException;
import com.rentease.repository.AmenityRepository;
import com.rentease.repository.PropertyRepository;
import com.rentease.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    PropertyRepository properties;

    @Mock
    UserRepository users;

    @Mock
    AmenityRepository amenities;

    private PropertyService service;

    @BeforeEach
    void setUp() {
        service = new PropertyService(properties, users, amenities);
    }

    @Test
    void searchUsesRequestedDatabasePageAndRentSort() {

        when(properties.findAll(
                any(Specification.class),
                any(Pageable.class)))
            .thenAnswer(invocation ->
                new PageImpl<>(
                    List.of(),
                    invocation.getArgument(1),
                    21
                )
            );

        var result = service.search(
            "Pune",
            null,
            null,
            null,
            null,
            List.of(),
            true,
            null,
            null,
            null,
            2,
            7,
            "rent_asc"
        );

        ArgumentCaptor<Pageable> pageable =
            ArgumentCaptor.forClass(Pageable.class);

        verify(properties).findAll(
            any(Specification.class),
            pageable.capture()
        );

        assertEquals(
            2,
            pageable.getValue().getPageNumber()
        );

        assertEquals(
            7,
            pageable.getValue().getPageSize()
        );

        assertEquals(
            "monthlyRent: ASC",
            pageable.getValue().getSort().toString()
        );

        assertEquals(
            21,
            result.totalElements()
        );

        assertEquals(
            3,
            result.totalPages()
        );
    }

    @Test
    void createStoresNewListingAsPendingReview() {

        User owner = new User();
        owner.setEmail("owner@example.test");
        owner.setName("Owner");

        when(users.findByEmail(owner.getEmail()))
            .thenReturn(Optional.of(owner));

        when(properties.save(any(Property.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        PropertyRequest request = new PropertyRequest(
            "Demo room",
            "A demo room description",
            PropertyType.ROOM,
            new BigDecimal("9000"),
            new BigDecimal("9000"),
            "Demo City",
            "Demo Locality",
            "Demo-only location",
            null,
            null,
            "SINGLE",
            1,
            LocalDate.now(),
            null,
            List.of(),
            List.of()
        );

        var response = service.create(
            request,
            owner.getEmail()
        );

        assertEquals(
            "PENDING",
            response.approvalStatus()
        );

        assertEquals(
            "Demo room",
            response.title()
        );

        assertEquals(
            1,
            response.availableRooms()
        );
    }

    @Test
    void ownerCannotEditListingOwnedBySomeoneElse() {

        User owner = new User();
        owner.setEmail("owner@example.test");

        Property property = new Property();
        property.setOwner(owner);

        when(properties.findById(88L))
            .thenReturn(Optional.of(property));

        BusinessException error = assertThrows(
            BusinessException.class,
            () -> service.update(
                88L,
                null,
                "another-owner@example.test"
            )
        );

        assertEquals(
            403,
            error.getStatus().value()
        );
    }
}

