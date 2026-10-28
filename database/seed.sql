-- Demo-only fixtures: create demo-owner@rentease.test as an OWNER and
-- demo-student@rentease.test as a STUDENT through the registration page first.
-- These listings use invented demo districts, no street addresses and no coordinates.
-- Image URLs are generic stock placeholders, not photos of these demo listings.
SET @demo_owner_id = (SELECT id FROM users WHERE email = 'demo-owner@rentease.test' AND role = 'OWNER');
SET @demo_student_id = (SELECT id FROM users WHERE email = 'demo-student@rentease.test' AND role = 'STUDENT');

DELIMITER //
CREATE PROCEDURE assert_rentease_demo_accounts()
BEGIN
    IF @demo_owner_id IS NULL OR @demo_student_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Register demo-owner@rentease.test and demo-student@rentease.test before running database/seed.sql';
    END IF;
END//
DELIMITER ;
CALL assert_rentease_demo_accounts();
DROP PROCEDURE assert_rentease_demo_accounts;

INSERT IGNORE INTO amenities (name) VALUES
    ('Wi-Fi'), ('AC'), ('Meals'), ('Furnished'), ('Parking'), ('Laundry');

INSERT INTO properties
    (owner_id, title, description, property_type, monthly_rent, security_deposit, city, locality,
     full_address, occupancy_type, available_rooms, available_from, approval_status, active, house_rules)
VALUES
    (@demo_owner_id, 'Garden View PG - demo listing', 'Demo-only furnished shared accommodation. Confirm all facilities and current availability with the owner.', 'PG', 9500, 9500, 'Pune Demo City', 'Garden Demo District', 'Demo-only location; no street address supplied.', 'SHARED', 3, CURRENT_DATE, 'APPROVED', TRUE, 'Demo listing. Agree house rules directly before booking.'),
    (@demo_owner_id, 'Quiet Corner Room - demo listing', 'A sample private room listing for local development and UI testing.', 'ROOM', 12500, 12500, 'Bengaluru Demo City', 'North Demo District', 'Demo-only location; no street address supplied.', 'SINGLE', 1, CURRENT_DATE, 'APPROVED', TRUE, 'Demo listing.'),
    (@demo_owner_id, 'Campus House Flat - demo listing', 'Sample shared flat listing with furnished rooms and a flexible move-in request.', 'FLAT', 18000, 30000, 'Hyderabad Demo City', 'Campus Demo District', 'Demo-only location; no street address supplied.', 'DOUBLE', 2, CURRENT_DATE, 'APPROVED', TRUE, 'Demo listing.'),
    (@demo_owner_id, 'Community Hostel - demo listing', 'A demonstration hostel listing for exploring common areas and amenities.', 'HOSTEL', 7000, 7000, 'Delhi Demo City', 'Central Demo District', 'Demo-only location; no street address supplied.', 'SHARED', 5, CURRENT_DATE, 'APPROVED', TRUE, 'Demo listing.');

INSERT INTO property_amenities (property_id, amenity_id)
SELECT p.id, a.id FROM properties p JOIN amenities a
WHERE p.owner_id = @demo_owner_id AND p.title IN
    ('Garden View PG - demo listing', 'Quiet Corner Room - demo listing', 'Campus House Flat - demo listing', 'Community Hostel - demo listing')
  AND ((p.property_type = 'PG' AND a.name IN ('Wi-Fi', 'Meals', 'Furnished', 'Laundry'))
    OR (p.property_type = 'ROOM' AND a.name IN ('Wi-Fi', 'AC', 'Furnished'))
    OR (p.property_type = 'FLAT' AND a.name IN ('Wi-Fi', 'AC', 'Furnished', 'Parking'))
    OR (p.property_type = 'HOSTEL' AND a.name IN ('Wi-Fi', 'Meals', 'Laundry')));

INSERT INTO property_images (property_id, image_url, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', TRUE, 0
FROM properties WHERE owner_id = @demo_owner_id AND title IN
    ('Garden View PG - demo listing', 'Quiet Corner Room - demo listing', 'Campus House Flat - demo listing', 'Community Hostel - demo listing');

INSERT INTO bookings (property_id, student_id, move_in_date, message, status)
SELECT p.id, @demo_student_id, DATE_ADD(CURRENT_DATE, INTERVAL 14 DAY),
       'Demo request for local workflow testing; this is not a real booking.', 'PENDING'
FROM properties p
WHERE p.owner_id = @demo_owner_id AND p.title = 'Garden View PG - demo listing'
LIMIT 1;
