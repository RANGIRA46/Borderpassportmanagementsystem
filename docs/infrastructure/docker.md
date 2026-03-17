# Docker Guide

This document explains how to build and run the Border/Passport Management System using Docker.

---

## 1. Prerequisites

- Docker ≥ 24.0
- Docker Compose ≥ 2.20

---

## 2. Quick Start (Development)

```bash
# Start the development environment
docker compose up --build

# Access the app
open http://localhost:3000
```

---

## 3. Building the Frontend Image Manually

```bash
# Build
docker build -t bpms-frontend:latest .

# Run
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=https://xxxx.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=eyJhb... \
  bpms-frontend:latest
```

---

## 4. Docker Compose Services

### Development (`docker-compose.yml`)

| Service | Port | Description |
|---------|------|-------------|
| `frontend` | 3000 | Vite preview of the built frontend |

### Production (`docker-compose.prod.yml`)

| Service | Port | Description |
|---------|------|-------------|
| `frontend` | 3000 | Optimised production frontend |

---

## 5. Environment Variables in Docker

Pass environment variables through Docker Compose's `environment` section or an `.env` file:

```bash
# Create an env file for Docker
cp .env.example .env
# Edit .env with your values

# Docker Compose picks up .env automatically
docker compose up
```

---

## 6. Multi-Stage Build

The `Dockerfile` uses a two-stage build to keep the production image small:

1. **builder stage** — installs dependencies and runs `npm run build`.
2. **runtime stage** — copies only the compiled `dist/` output.

This means the final image does **not** contain `node_modules` or source files.

---

## 7. Image Sizes

| Image | Approximate Size |
|-------|-----------------|
| Builder stage | ~500 MB |
| Runtime image | ~80 MB |

---

## 8. Health Checks

The `Dockerfile` includes a health check that hits the Nginx status page every 30 seconds.  
Docker Compose waits for the health check to pass before marking the container as healthy.

---

## 9. Updating Dependencies

After updating `package.json`:

```bash
docker compose build --no-cache frontend
docker compose up -d frontend
```
