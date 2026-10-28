# RentEase

RentEase is a full-stack accommodation listings and booking-request application for students, owners and administrators.

## Stack

- Frontend: React 18, Vite 6, Tailwind CSS 4 and React Leaflet.
- Backend: Java 17, Spring Boot 3.5, Spring Security, JWT and Spring Data JPA.
- Database: MySQL 8, managed with Flyway migrations.
- API reference: [docs/API.md](./docs/API.md)

## Repository layout

```text
RentEase/
|-- backend/
|   |-- src/main/java/com/rentease/
|   |   |-- config/          CORS and Spring Security
|   |   |-- controller/      REST API endpoints
|   |   |-- dto/             Validated requests and response records
|   |   |-- entity/          JPA entities and enums
|   |   |-- exception/       API error handling
|   |   |-- repository/      Spring Data repositories
|   |   |-- security/        JWT filter and identity helpers
|   |   `-- service/         Business rules and transactions
|   |-- src/main/resources/
|   |   |-- db/migration/    Flyway migrations
|   |   `-- application.properties
|   |-- src/test/java/       Service unit tests
|   |-- .env.example
|   `-- pom.xml
|-- database/
|   |-- schema.sql           Standalone MySQL schema reference
|   `-- seed.sql             Optional local-only demonstration fixtures
|-- docs/API.md
|-- frontend/
|   |-- src/
|   |   |-- components/      Shared UI components
|   |   |-- context/         In-memory auth state
|   |   |-- layouts/         Main layout
|   |   |-- pages/           Public, student, owner and admin screens
|   |   |-- services/        API clients
|   |   `-- utils/
|   |-- .env.example
|   `-- package.json
|-- docker-compose.yml       Optional MySQL 8.4 for local development
`-- .gitignore
```

## Prerequisites

- Node.js 20 or newer and npm.
- Java 17 and Maven 3.9 or newer.
- MySQL 8.0 or newer. Docker Compose is optional.

## Local setup

### 1. Start MySQL

Either create a local MySQL database and user named `rentease`, or start the optional database container:

```powershell
docker compose up -d mysql
```

The compose defaults (`local-dev-password` and `local-root-password`) are for local development only. Do not reuse them outside your machine.

### 2. Configure and run the backend

Flyway creates the schema at startup. `spring.jpa.hibernate.ddl-auto=validate` ensures Hibernate will not modify the schema.

```powershell
$env:SPRING_DATASOURCE_URL = "jdbc:mysql://localhost:3306/rentease?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:SPRING_DATASOURCE_USERNAME = "rentease"
$env:SPRING_DATASOURCE_PASSWORD = "local-dev-password"
$env:RENTEASE_JWT_SECRET = node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
$env:RENTEASE_CORS_ORIGINS = "http://localhost:5173"

# Optional: configure the first administrator. Both values must be present.
$env:RENTEASE_ADMIN_EMAIL = "admin@rentease.local"
$env:RENTEASE_ADMIN_PASSWORD = "use-a-unique-password-of-at-least-12-characters"

mvn -f backend\pom.xml spring-boot:run
```

The first admin account is created only when both admin variables are configured and that email does not already exist. Admin accounts cannot be created through public registration. Remove the bootstrap variables after the account is created.

For a local MySQL account with a different password, set the corresponding database environment variable to match it. Flyway migrations are in `backend/src/main/resources/db/migration/`.

### 3. Run the frontend

Open another PowerShell terminal:

```powershell
Copy-Item frontend\.env.example frontend\.env.local
# Edit frontend\.env.local if the API is not at http://localhost:8080/api.
npm --prefix frontend install
npm --prefix frontend run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

### 4. Optional demo data

Create these accounts through the registration screen:

- `demo-owner@rentease.test` with the Owner role.
- `demo-student@rentease.test` with the Student role.

Then run `database/seed.sql` once against the local database. It adds clearly labelled fictional demonstration properties and a pending demo request. The sample data contains no claimed street addresses or map coordinates; sample image links are generic stock placeholders. Do not run it against production.

## Authentication and security choices

- API authentication uses short-lived (15-minute by default) signed JWT bearer tokens. BCrypt hashes passwords.
- The frontend keeps the bearer token in JavaScript memory only; it is not written to localStorage, sessionStorage, cookies or URLs. Refreshing or closing the tab signs the user out. This reduces persistence of a stolen token but does not protect an active session from same-origin script compromise.
- Set `RENTEASE_JWT_SECRET` to a randomly generated secret of at least 32 bytes. Do not commit `.env` files or production credentials.
- CORS is restricted to `RENTEASE_CORS_ORIGINS`; configure the exact HTTPS frontend origin in production.
- Roles and ownership are checked by the backend. Admin registration is disabled.
- Property images are URL references, not database blobs. The application does not upload files or validate that a URL points to a safe or permanent image host.
- Booking requests do not collect money and are not legal confirmations. Owners must confirm details and availability.

## Tests and checks

Run backend unit tests:

```powershell
mvn -f backend\pom.xml test
```

Create a production frontend bundle:

```powershell
npm --prefix frontend run build
```

Check npm dependencies:

```powershell
npm --prefix frontend audit
```

The committed tests cover application-context startup/JPA mappings, registration/login rules, database pagination/sorting, owner/student authorization checks and booking capacity. They do not replace testing against a running MySQL instance. API examples and role requirements are in [docs/API.md](./docs/API.md).

## API quick start

Register a student:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/auth/register `
  -ContentType "application/json" `
  -Body '{"name":"Demo Student","email":"student@example.test","password":"ChangeThisPassword123!","role":"STUDENT"}'
```

Log in and use the returned `token` as `Authorization: Bearer <token>`. Browse homes at `GET /api/properties?location=Pune&minRent=5000&maxRent=20000&type=PG&page=0&size=12&sort=rent_asc`. See [docs/API.md](./docs/API.md) for endpoint details.

## Deployment outline

1. **MySQL:** Create a managed MySQL 8 database and a least-privilege application user. Permit network access only from the backend host.
2. **Backend:** Build with `mvn -f backend\pom.xml clean package`. Deploy the JAR to a Java 17+ host. Set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, a generated `RENTEASE_JWT_SECRET`, and the exact `RENTEASE_CORS_ORIGINS` value. The service applies Flyway migrations on startup.
3. **Frontend:** Build with `npm --prefix frontend run build`; publish `frontend/dist` to a static host. Set `VITE_API_BASE_URL` to the HTTPS backend API URL before building. Set `VITE_SUPPORT_EMAIL` only if an actual support mailbox is configured.
4. **Images:** The current implementation accepts image URLs only. If the hosting provider has ephemeral storage, configure a permanent HTTPS image host; do not rely on local uploads.
5. **HTTPS:** Terminate TLS at the hosting platform or reverse proxy. Never expose the backend or database over plaintext public endpoints.

## GitHub upload

Create an empty GitHub repository, then from this project directory:

```powershell
git init
git add .
git commit -m "Build RentEase full-stack application"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

Review staged files before committing. `.env`, `node_modules`, build output and Maven `target` directories are ignored.

## Implementation checklist

- [x] React/Vite/Tailwind app with public, student, owner and admin routes.
- [x] JWT auth, role checks, owner-only listing operations and admin bootstrapping.
- [x] Database-backed property filters, sorting and pagination.
- [x] Listings, favorites, property moderation and reports.
- [x] Booking requests, owner decisions, cancellation and capacity locking.
- [x] Flyway schema migrations, schema reference and optional demo data.
- [x] API documentation, environment examples, deployment guidance and service unit tests.
- [ ] MySQL-backed end-to-end/API tests and a browser QA pass (requires MySQL running).
- [ ] Image file upload/Cloudinary integration and editable user profiles (not implemented; URLs/read-only profiles are supported).
- [ ] Production deployment and provider-specific secrets/domains (operator configuration required).
