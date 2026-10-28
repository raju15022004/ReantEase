package com.rentease.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "amenities", uniqueConstraints = @UniqueConstraint(name = "uk_amenities_name", columnNames = "name"))
public class Amenity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 60)
    private String name;

    protected Amenity() {}
    public Amenity(String name) { this.name = name; }
    public Long getId() { return id; }
    public String getName() { return name; }
}
