# Deployment Guide

This document describes how to deploy the Border/Passport Management System to staging and production environments.

---

## 1. Environments

| Environment | Trigger | Purpose |
|-------------|---------|---------|
| Development | Local machine | Active development and debugging |
| Staging | Push to `develop` branch | QA, UAT, integration testing |
| Production | Release tag (e.g. `v1.2.0`) | Live service |

---

## 2. Prerequisites

- Docker ≥ 24 and Docker Compose ≥ 2
- Access to container registry (GitHub Container Registry or Docker Hub)
- Supabase project configured (see [SETUP.md](./SETUP.md))
- Required secrets stored in your CI/CD environment or secret manager

---

## 3. Docker Deployment

### 3.1 Build the Frontend Image

```bash
docker build -t bpms-frontend:latest .
```

### 3.2 Build for Production

```bash
docker build --target runtime -t bpms-frontend:production .
```

### 3.3 Run with Docker Compose (Development)

```bash
docker compose up --build
```

Services started:
- **Frontend** on `http://localhost:3000`

### 3.4 Run with Docker Compose (Production)

```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## 4. GitHub Actions CI/CD

The repository includes four workflow files in `.github/workflows/`:

| Workflow | File | Trigger |
|----------|------|---------|
| Test & Build | `test.yml` | Every push and pull request |
| Deploy to Staging | `deploy-staging.yml` | Push to `develop` branch |
| Deploy to Production | `deploy-prod.yml` | Release tag push |
| Security Scanning | `security.yml` | Every push to `main`/`develop` |

### 4.1 Required Secrets

Configure these secrets in **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Used by |
|--------|---------|
| `VITE_SUPABASE_URL` | build step |
| `VITE_SUPABASE_ANON_KEY` | build step |
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI deployment |
| `SUPABASE_PROJECT_ID` | Supabase CLI deployment |
| `REGISTRY_USERNAME` | Container registry push |
| `REGISTRY_PASSWORD` | Container registry push |

---

## 5. Database Migrations

Always run migrations **before** deploying new application code.

```bash
# Using Supabase CLI
supabase db push --project-ref <project-ref>

# Using migration runner directly
npx ts-node migrations/migration.ts
```

To roll back:

```bash
npx ts-node migrations/rollback.ts
```

---

## 6. Pre-Deployment Checklist

- [ ] All tests passing on CI
- [ ] Code review approved
- [ ] Documentation updated
- [ ] Database migration tested on staging
- [ ] Environment variables configured
- [ ] Secrets secured (no plaintext secrets in code)
- [ ] Backup verified

---

## 7. Deployment Steps

### 7.1 Staging

1. Merge feature branch into `develop`.
2. GitHub Actions automatically:
   - Runs lint and tests
   - Builds Docker image and pushes to registry
   - Deploys to staging environment
   - Runs smoke tests
3. QA team performs UAT on staging.

### 7.2 Production

1. Create a release tag: `git tag v1.x.0 && git push origin v1.x.0`
2. GitHub Actions automatically:
   - Runs the full test suite
   - Builds optimised production image
   - Runs database migrations
   - Deploys using blue-green strategy
   - Runs health checks
   - Rolls back automatically on health check failure
3. Monitor error rates and latency for 30 minutes after deployment.

---

## 8. Post-Deployment Checklist

- [ ] Monitor error rates (target < 1%)
- [ ] Check API latency (target < 500 ms p95)
- [ ] Verify database backup ran successfully
- [ ] Test all critical user flows (submit application, check status, book appointment)
- [ ] Review application logs for unexpected errors
- [ ] Document any issues or incidents

---

## 9. Rollback Procedure

### Application Rollback

```bash
# Re-deploy the previous image tag
docker compose -f docker-compose.prod.yml up -d \
  --no-deps \
  --scale frontend=1 \
  frontend

# Or via GitHub Actions: re-run the previous successful deploy workflow
```

### Database Rollback

```bash
npx ts-node migrations/rollback.ts
```

> ⚠️ Database rollbacks should only be performed if the new schema is incompatible with existing data. Always take a backup before rolling back.
