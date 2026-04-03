# SmartQ

SmartQ is a full-stack smart banking queue and appointment system with a Next.js frontend and a Spring Boot backend.

## Stack

- Frontend: Next.js 15 with React 19
- Backend: Spring Boot 3 with Java 21
- Database: PostgreSQL 16
- Auth: JWT-based authentication

## Project Structure

- `frontend/`: Next.js customer, staff, and admin portal
- `backend/`: Spring Boot REST API
- `infra/docker/`: local PostgreSQL setup
- `render.yaml`: backend and database blueprint for Render
- `.github/workflows/`: CI and optional deploy automation
- `docs/deployment.md`: deployment setup guide

## Local Development

1. Start PostgreSQL if you are working with persisted data:

```powershell
docker compose -f infra/docker/docker-compose.yml up -d
```

The database is exposed on `localhost:6543` to avoid clashes with existing local PostgreSQL instances.

2. Start the backend:

```powershell
cd backend
mvn spring-boot:run
```

3. Start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

The backend runs Flyway migrations and seeds sample users, branches, services, appointments, notifications, and queue events on first startup.

## Recommended Deployment

Recommended production layout:

- Frontend on Vercel
- Backend on Render
- Database on Render PostgreSQL

This repository also keeps Railway support for the backend through `backend/Dockerfile` and `backend/railway.json`.

See `docs/deployment.md` for the exact deployment steps, required environment variables, and GitHub Actions secrets.

## Demo Credentials

These are seeded into the database on first startup:

- `customer@smartq.local` / `Customer@123`
- `staff@smartq.local` / `Staff@123`
- `admin@smartq.local` / `Admin@123`

## CI/CD

The repository now includes:

- `.github/workflows/ci.yml` for frontend and backend verification
- `.github/workflows/deploy.yml` for optional GitHub Actions based production deploys using deploy hooks
