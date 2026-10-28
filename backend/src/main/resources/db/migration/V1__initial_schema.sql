CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(20) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('STUDENT', 'OWNER', 'ADMIN'))
);

CREATE TABLE properties (
    id BIGINT NOT NULL AUTO_INCREMENT,
    owner_id BIGINT NOT NULL,
    title VARCHAR(180) NOT NULL,
    description VARCHAR(5000) NOT NULL,
    property_type VARCHAR(20) NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) NOT NULL,
    city VARCHAR(100) NOT NULL,
    locality VARCHAR(120) NOT NULL,
    full_address VARCHAR(500) NOT NULL,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    occupancy_type VARCHAR(40),
    available_rooms INT NOT NULL,
    available_from DATE NOT NULL,
    approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    house_rules VARCHAR(2000),
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_properties_owner FOREIGN KEY (owner_id) REFERENCES users(id),
    CONSTRAINT chk_property_type CHECK (property_type IN ('PG', 'ROOM', 'FLAT', 'HOSTEL')),
    CONSTRAINT chk_property_approval CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    CONSTRAINT chk_property_rent CHECK (monthly_rent >= 0 AND security_deposit >= 0 AND available_rooms >= 0),
    INDEX idx_properties_search (approval_status, active, city, property_type, monthly_rent),
    INDEX idx_properties_owner (owner_id, active)
);

CREATE TABLE property_images (
    id BIGINT NOT NULL AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_images_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE amenities (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_amenities_name UNIQUE (name)
);

CREATE TABLE property_amenities (
    property_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    PRIMARY KEY (property_id, amenity_id),
    CONSTRAINT fk_property_amenities_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_property_amenities_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(id)
);

CREATE TABLE bookings (
    id BIGINT NOT NULL AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    move_in_date DATE NOT NULL,
    message VARCHAR(2000),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_bookings_property FOREIGN KEY (property_id) REFERENCES properties(id),
    CONSTRAINT fk_bookings_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT chk_booking_status CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED')),
    INDEX idx_bookings_property_status (property_id, status),
    INDEX idx_bookings_student (student_id, created_at)
);

CREATE TABLE favorites (
    id BIGINT NOT NULL AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_favorites_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT uk_favorite_student_property UNIQUE (student_id, property_id)
);
