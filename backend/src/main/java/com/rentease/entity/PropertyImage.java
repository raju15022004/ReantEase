package com.rentease.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "property_images")
public class PropertyImage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;
    @Column(name = "is_primary", nullable = false)
    private boolean primary;
    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    protected PropertyImage() {}
    public PropertyImage(Property property, String imageUrl, boolean primary, int displayOrder) {
        this.property = property;
        this.imageUrl = imageUrl;
        this.primary = primary;
        this.displayOrder = displayOrder;
    }
    public Long getId() { return id; }
    public String getImageUrl() { return imageUrl; }
    public boolean isPrimary() { return primary; }
    public int getDisplayOrder() { return displayOrder; }
}
