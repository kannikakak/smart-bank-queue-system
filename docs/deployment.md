# Deployment Guide

## Recommended Hosting Layout

For this repository, the cleanest deployment setup is:

- Frontend: Vercel
- Backend API: Render web service
- Database: Render PostgreSQL

This matches the codebase well:

- `frontend/` is a Next.js app and Vercel is the lowest-friction host for it.
- `backend/` is already prepared for container deployment and this repository already includes `render.yaml`.
- Render handles the Spring Boot API and PostgreSQL cleanly in one place.

If you prefer Railway for the backend, `backend/railway.json` and `backend/Dockerfile` are already in the repo. The GitHub Actions deploy workflow added here is set up for Render by default because the repository already includes a Render blueprint.

## Monorepo Structure

- `frontend/`: deploy as a separate Vercel project
- `backend/`: deploy as a separate Render web service
- `render.yaml`: Render blueprint for the backend service and PostgreSQL database
- `.github/workflows/ci.yml`: CI for frontend and backend
- `.github/workflows/deploy.yml`: optional CD via deploy hooks after CI passes on `main`

## Frontend Deployment

Create a Vercel project from this repository and set:

- Root Directory: `frontend`
- Framework Preset: `Next.js`
- Install Command: `npm ci`
- Build Command: `npm run build`

Frontend environment variables:

- `NEXT_PUBLIC_API_BASE_URL=https://your-backend-service.onrender.com`

## Backend Deployment

Create the backend service from `render.yaml` or create a Render web service manually with:

- Root Directory: `backend`
- Runtime: `Docker`
- Health Check Path: `/actuator/health`

Backend environment variables:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SMARTQ_JWT_SECRET`
- `SMARTQ_JWT_EXPIRATION_MINUTES`
- `SMARTQ_CORS_ALLOWED_ORIGIN=https://your-frontend-project.vercel.app`

## GitHub Actions CI/CD

This repository now includes:

- `CI`: runs frontend lint/build and backend Maven verification
- `Deploy`: after a successful push to `main`, triggers deploy hooks for Vercel and Render

Configure these GitHub repository secrets if you want GitHub Actions to trigger deployments:

- `VERCEL_FRONTEND_DEPLOY_HOOK_URL`
- `RENDER_BACKEND_DEPLOY_HOOK_URL`

If you keep native Git-based auto deploy enabled in Vercel or Render, do not also use the deploy-hook workflow unless you want duplicate production deploys.

## Deployment Order

1. Deploy the backend and database first.
2. Copy the backend public URL into Vercel as `NEXT_PUBLIC_API_BASE_URL`.
3. Copy the frontend public URL into Render as `SMARTQ_CORS_ALLOWED_ORIGIN`.
4. Push to `main` to let CI run.
5. If deploy hooks are configured, GitHub Actions will trigger production deploys automatically after CI succeeds.
