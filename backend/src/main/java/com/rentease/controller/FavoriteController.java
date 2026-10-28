package com.rentease.controller;

import com.rentease.dto.PropertyDtos.PropertyResponse;
import com.rentease.service.FavoriteService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/favorites")
public class FavoriteController {
    private final FavoriteService favorites;
    public FavoriteController(FavoriteService favorites) { this.favorites = favorites; }

    @GetMapping
    public List<PropertyResponse> list(Authentication auth) { return favorites.list(auth.getName()); }

    @PostMapping("/{propertyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void add(@PathVariable Long propertyId, Authentication auth) { favorites.add(auth.getName(), propertyId); }

    @DeleteMapping("/{propertyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable Long propertyId, Authentication auth) { favorites.remove(auth.getName(), propertyId); }
}
