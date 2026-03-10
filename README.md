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

## Render Deployment

This repo includes a root-level `render.yaml` that provisions:

- a Render web service for `backend/`
- a Render PostgreSQL database

Render will build the backend with Maven and start the packaged Spring Boot jar. The app now reads `PORT` from the environment so it can bind correctly on Render.

Required environment values on Render:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SMARTQ_JWT_SECRET`
- `SMARTQ_JWT_EXPIRATION_MINUTES`
- `SMARTQ_CORS_ALLOWED_ORIGIN`

If you deploy with the Blueprint:

1. Push this repository to GitHub.
2. In Render, choose `New +` -> `Blueprint`.
3. Select the repository and confirm the generated `smartq-backend` service plus `smartq-postgres` database.
4. When prompted, set `SMARTQ_CORS_ALLOWED_ORIGIN` to your frontend URL.
5. Deploy and wait for the service health check at `/actuator/health` to pass.

If you deploy manually without the Blueprint:

1. Create a PostgreSQL database on Render.
2. Create a web service from this repository with root directory `backend`.
3. Use build command `mvn -q -DskipTests package`.
4. Use start command `java -jar target/smartq-backend-0.1.0.jar`.
5. Copy the Render database connection values into the Spring datasource environment variables above.

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

## CI

GitHub Actions is not required for Render deployment, but it helps your rubric. This repo now includes `.github/workflows/backend-ci.yml` to run backend verification on pushes and pull requests that touch `backend/`.
