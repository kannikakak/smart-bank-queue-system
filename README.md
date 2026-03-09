# SmartQ

SmartQ is a backend API for a smart banking appointment and branch queue management system.

## Stack

- Backend: Spring Boot 3 with Java 21
- Database: PostgreSQL 16
- Auth baseline: JWT-ready security scaffold

## Project Structure

- `backend/` Spring Boot REST API
- `infra/docker/` local PostgreSQL setup

## Local Development

1. Start PostgreSQL if you are adding persistence work:

```powershell
docker compose -f infra/docker/docker-compose.yml up -d
```

The project PostgreSQL container is exposed on `localhost:6543` to avoid clashes with local Postgres services already using the default port.

2. Backend:

Install Maven first, then run:

```powershell
cd backend
mvn spring-boot:run
```

The backend now uses PostgreSQL-backed auth and domain data. On first start it runs Flyway migrations and seeds sample users, branches, services, appointments, notifications, and queue events.

Use Postman against the backend once it is running locally.

## Demo API Credentials

These are seeded into the database on first startup:

- `customer@smartq.local` / `Customer@123`
- `staff@smartq.local` / `Staff@123`
- `admin@smartq.local` / `Admin@123`

## Initial Scope

The scaffold includes:

- Backend controller structure for auth, branches, services, appointments, queue, and analytics
- JWT token service and security filter baseline
- Docker Compose setup for PostgreSQL
