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

## Railway Deployment

This backend is now prepared for Railway deployment using the Dockerfile in `backend/` plus `backend/railway.json`.

Railway should deploy the `backend/` directory as a single service. The app reads `PORT` from the environment, so it will bind correctly on Railway.

Required environment values on Railway:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SMARTQ_JWT_SECRET`
- `SMARTQ_JWT_EXPIRATION_MINUTES`
- `SMARTQ_CORS_ALLOWED_ORIGIN`

Recommended Railway steps:

1. Push this repository to GitHub.
2. In Railway, create a new project from your GitHub repository.
3. Set the service root directory to `backend`.
4. Railway should detect `backend/Dockerfile` and `backend/railway.json`.
5. Add a PostgreSQL database service in Railway, or connect an external PostgreSQL instance.
6. Set the environment variables above on the backend service.
7. Set `SMARTQ_CORS_ALLOWED_ORIGIN` to your frontend URL.
8. Deploy and wait for the health check at `/actuator/health` to pass.

If you use a Railway PostgreSQL service, copy its connection values into:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

If you prefer Render later, the repo still contains `render.yaml`, but Railway is the primary deployment target in this setup.

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

GitHub Actions is not required for Railway deployment, but it helps your rubric. This repo includes `.github/workflows/backend-ci.yml` to run backend verification on pushes and pull requests that touch `backend/`.
