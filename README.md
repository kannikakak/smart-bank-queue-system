# SmartQ

SmartQ is a full-stack starter for a smart banking appointment and branch queue management system.

## Stack

- Frontend: Next.js App Router with TypeScript
- Backend: Spring Boot 3 with Java 21
- Database: PostgreSQL 16
- Auth baseline: JWT-ready security scaffold

## Project Structure

- `frontend/` Next.js application for customers, staff, and managers
- `backend/` Spring Boot REST API
- `infra/docker/` local PostgreSQL setup

## Local Development

1. Start PostgreSQL if you are adding persistence work:

```powershell
docker compose -f infra/docker/docker-compose.yml up -d
```

2. Frontend:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

3. Backend:

Install Maven first, then run:

```powershell
cd backend
mvn spring-boot:run
```

The current demo backend uses in-memory data for auth and sample APIs, so PostgreSQL is not required just to start the app.

## Demo API Credentials

These are seeded in the backend demo identity service:

- `customer@smartq.local` / `Customer@123`
- `staff@smartq.local` / `Staff@123`
- `admin@smartq.local` / `Admin@123`

## Initial Scope

The scaffold includes:

- Landing page and role dashboards
- Login page wired to the backend auth endpoint
- Backend controller structure for auth, branches, services, appointments, queue, and analytics
- JWT token service and security filter baseline
- Docker Compose setup for PostgreSQL
