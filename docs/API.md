# RentEase API

Base URL: `http://localhost:8080/api`

JSON request bodies use `Content-Type: application/json`. Protected endpoints require `Authorization: Bearer <token>`. Successful JSON responses use the documented object shape; errors use `{ "timestamp", "status", "error", "message", "path" }`. Password hashes and JWT signing keys are never returned.

## Authentication

### `POST /auth/register`

```json
{
  "name": "Asha Student",
  "email": "asha@example.test",
  "password": "ChangeThisPassword123!",
  "phone": "+91 90000 00000",
  "role": "STUDENT"
}
```

Allowed public roles are `STUDENT` and `OWNER`; omitted role defaults to `STUDENT`. `ADMIN` is rejected.
Registration responds with `201 Created`; login responds with `200 OK`.

### `POST /auth/login`

```json
{ "email": "asha@example.test", "password": "ChangeThisPassword123!" }
```

Registration and login return:

```json
{
  "token": "<short-lived JWT>",
  "tokenType": "Bearer",
  "expiresIn": 900000,
  "user": { "id": 1, "name": "Asha Student", "email": "asha@example.test", "phone": "+91 90000 00000", "role": "STUDENT" }
}
```

### `GET /auth/me`

Authenticated. Returns the current user object without a token.

## Properties and search

### `GET /properties`

Public. Filters are evaluated in the database. Supported query parameters:

| Parameter | Description |
| --- | --- |
| `location` | Case-insensitive city or locality substring |
| `minRent`, `maxRent` | Inclusive rent bounds |
| `type` | `PG`, `ROOM`, `FLAT`, `HOSTEL` |
| `occupancy` | Occupancy label, case-insensitive |
| `amenities` | Comma-separated names, e.g. `Wi-Fi,AC` |
| `availableOnly` | `true` by default |
| `sort` | `newest`, `rent_asc`, `rent_desc` |
| `page`, `size` | Zero-based page; size is capped at 50 |

Example: `GET /properties?location=Pune&minRent=5000&maxRent=20000&type=PG&amenities=Wi-Fi,Meals&sort=rent_asc&page=0&size=12`

Page response:

```json
{
  "content": [
    {
      "id": 12,
      "title": "Demo PG listing",
      "description": "Owner-provided listing details",
      "propertyType": "PG",
      "monthlyRent": 9500.00,
      "securityDeposit": 9500.00,
      "city": "Pune",
      "locality": "Example locality",
      "fullAddress": "Owner-provided address",
      "latitude": null,
      "longitude": null,
      "occupancyType": "SHARED",
      "availableRooms": 2,
      "availableFrom": "2026-11-15",
      "houseRules": "Ask the owner",
      "approvalStatus": "APPROVED",
      "active": true,
      "amenities": ["Meals", "Wi-Fi"],
      "imageUrls": [],
      "owner": { "id": 5, "name": "Property Owner" },
      "createdAt": "2026-10-25T12:00:00Z"
    }
  ],
  "page": 0,
  "size": 12,
  "totalElements": 1,
  "totalPages": 1
}
```

### `GET /properties/featured` and `GET /properties/{id}`

Public. Featured returns up to six approved active listings. Detail returns only approved active listings; pending, rejected, inactive and missing listings return `404`.

### Owner property endpoints

Require `OWNER`. `POST /owner/properties`, `PUT /owner/properties/{id}`, and `GET /owner/properties/{id}` use the property request/response shape above. Creation and edits set approval to `PENDING`. `GET /owner/properties?page=0&size=20` returns the owner's own listings. `DELETE /owner/properties/{id}` deactivates the listing and responds `204`. `PATCH /owner/properties/{id}/availability` takes `{ "availableRooms": 2, "active": true }`. Owners cannot modify another owner's listing.

Property request fields: `title`, `description`, `propertyType`, `monthlyRent`, `securityDeposit`, `city`, `locality`, `fullAddress`, optional `latitude`, `longitude`, `occupancyType`, `availableRooms`, `availableFrom`, optional `houseRules`, `imageUrls` (HTTP/HTTPS URL list), and `amenities` (string list).

## Favorites

Require `STUDENT`.

- `GET /student/favorites` — list saved approved active properties.
- `POST /student/favorites/{propertyId}` — save; repeated requests are idempotent (`204`).
- `DELETE /student/favorites/{propertyId}` — remove (`204`).

The database has a unique `(student_id, property_id)` constraint.

## Bookings

- `POST /properties/{propertyId}/bookings` — `STUDENT`; body `{ "moveInDate": "2026-11-15", "message": "I would like to know more." }`.
- `GET /student/bookings?page=0&size=20` — `STUDENT`, own records only.
- `PATCH /student/bookings/{bookingId}/cancel` — `STUDENT`, own pending requests only.
- `GET /owner/bookings?page=0&size=20` — `OWNER`, requests for own listings only.
- `PATCH /owner/bookings/{bookingId}/status` — `OWNER`; body `{ "status": "ACCEPTED" }` or `{ "status": "REJECTED" }`.
- `GET /admin/bookings?page=0&size=20` — `ADMIN`.

The booking response includes property and student summaries, move-in date, message, status and creation timestamp. Accepted room capacity is checked while holding a write lock on the property. Owners cannot decide a finalized request. Booking requests do not collect money or represent a legal confirmation.

## Administration

All endpoints below require `ADMIN`. The first admin is provisioned by setting `RENTEASE_ADMIN_EMAIL` and `RENTEASE_ADMIN_PASSWORD` before backend startup; public admin registration is disabled.

- `GET /admin/dashboard` — account/listing/request counts.
- `GET /admin/users?role=STUDENT&page=0&size=20` — paged user summaries; optional `role` filter.
- `PATCH /admin/users/{id}/status` — `{ "enabled": false }`.
- `GET /admin/properties?status=PENDING&page=0&size=20` — all listings, optionally filtered by `PENDING`, `APPROVED` or `REJECTED`.
- `PATCH /admin/properties/{id}/approval` — `{ "status": "APPROVED" }` or `{ "status": "REJECTED" }`.
- `GET /admin/reports?page=0&size=20` — listing reports.
- `PATCH /admin/reports/{id}` — `{ "status": "REVIEWED" }` or `{ "status": "DISMISSED" }`.
- `POST /student/reports/{propertyId}` — `STUDENT`; body `{ "reason": "SUSPICIOUS_LISTING", "details": "Optional details" }`.

## Status codes

- `200` successful read/update.
- `201` resource creation where applicable.
- `204` successful no-content favorite removal/addition or property deactivation.
- `400` invalid request, enum, date or filter.
- `401` missing/invalid authentication or invalid login.
- `403` role or ownership restriction.
- `404` missing or non-public resource.
- `409` duplicate account, invalid booking transition or capacity conflict.
