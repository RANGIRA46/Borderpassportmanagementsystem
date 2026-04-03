# Database Setup Guide

## Overview

The Border Passport Management System uses **PostgreSQL** as its database backend. This guide covers local development database setup, migration procedures, and best practices.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Database Architecture](#database-architecture)
4. [Setup Methods](#setup-methods)
5. [Running Migrations](#running-migrations)
6. [Connecting to the Database](#connecting-to-the-database)
7. [Database Administration](#database-administration)
8. [Troubleshooting](#troubleshooting)
9. [Production Deployment](#production-deployment)

---

## Quick Start

### For Docker Users (Recommended)

```bash
# 1. Start PostgreSQL and Adminer
docker compose -f docker-compose.db.yml up -d

# 2. Initialize database with migrations
bash scripts/init-db.sh        # On Linux/macOS
.\scripts\init-db.bat           # On Windows

# 3. Database is ready at localhost:5432
```

### For Local PostgreSQL Installation

```bash
# 1. Create database and user
createdb borderpassport
createuser bpms_user

# 2. Set password
psql -c "ALTER USER bpms_user WITH PASSWORD 'dev_password_change_me';"

# 3. Run migrations
bash scripts/init-db.sh        # On Linux/macOS
.\scripts\init-db.bat           # On Windows
```

---

## Prerequisites

### For Docker Deployment

- **Docker** ≥ 24.0
- **Docker Compose** ≥ 2.20

Install from: https://www.docker.com/products/docker-desktop

### For Local PostgreSQL

- **PostgreSQL** ≥ 14
- **pg_restore** (comes with PostgreSQL)

#### Installation

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Windows:**
Download from: https://www.postgresql.org/download/windows/

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## Database Architecture

### Schema Overview

```
┌─────────────────────────────────────────────┐
│         Border Passport Management           │
│              PostgreSQL Database             │
└─────────────────────────────────────────────┘
    ├── User Management
    │   ├── profiles (user profiles & roles)
    │   ├── sessions (authentication tokens)
    │   └── audit_logs (user activity tracking)
    │
    ├── Applications
    │   ├── applications (passport/visa apps)
    │   ├── application_status_history (audit trail)
    │   ├── documents (uploaded documents)
    │   └── application_payments (fee tracking)
    │
    ├── Border Operations
    │   ├── appointments (scheduling)
    │   ├── border_crossings (entry/exit records)
    │   ├── border_posts (location management)
    │   └── crossing_events (detailed logs)
    │
    ├── Biometric & Security
    │   ├── biometric_data (facial/fingerprint)
    │   ├── watchlist_records (alerts/flags)
    │   └── identity_verifications (checks)
    │
    ├── System Management
    │   ├── system_configuration (settings)
    │   ├── notification_templates (messages)
    │   └── integration_logs (third-party sync)
    │
    └── Infrastructure
        ├── migration_history (version tracking)
        └── database_backups (recovery info)
```

### Key Tables

| Table | Purpose | Records |
|-------|---------|---------|
| `profiles` | User accounts & roles | Citizens, Officials, Admins |
| `applications` | Passport/Visa applications | Submitted forms |
| `documents` | Supporting documents | Scans, certificates |
| `appointments` | Appointment slots | Biometric appointments |
| `border_crossings` | Border entry/exit logs | Travel history |
| `biometric_data` | Facial/fingerprint data | Enrollment data |

---

## Setup Methods

### Method 1: Docker Compose (Recommended for Development)

#### Step 1: Start PostgreSQL

```bash
cd /path/to/Borderpassportmanagementsystem

# Copy environment variables
cp deployment/db.env .env.local

# Start PostgreSQL container
docker compose -f docker-compose.db.yml up -d

# Wait for container to be ready
docker compose -f docker-compose.db.yml logs postgres
```

#### Step 2: Initialize Database

```bash
# Linux/macOS
bash scripts/init-db.sh

# Windows
.\scripts\init-db.bat
```

#### Step 3: Verify Setup

```bash
# Check container status
docker compose -f docker-compose.db.yml ps

# View available tools
# - PostgreSQL: localhost:5432
# - Adminer (Web UI): http://localhost:8080
```

### Method 2: Local PostgreSQL Installation

#### Step 1: Create Database User

```bash
# As PostgreSQL superuser
sudo -u postgres psql

# Inside psql prompt:
CREATE USER bpms_user WITH PASSWORD 'dev_password_change_me';
CREATE DATABASE borderpassport OWNER bpms_user;
\q
```

#### Step 2: Run Migrations

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=borderpassport
export DB_USER=bpms_user
export DB_PASSWORD=dev_password_change_me

# Linux/macOS
bash scripts/init-db.sh

# Windows
.\scripts\init-db.bat
```

#### Step 3: Verify Setup

```bash
psql -h localhost -U bpms_user -d borderpassport -c "\dt"
```

---

## Running Migrations

### Automatic Migration on Startup

Migrations run automatically in Docker when PostgreSQL container starts:

```bash
docker compose -f docker-compose.db.yml up -d
```

The `migrations/` folder is mounted, and PostgreSQL runs all `.sql` files in alphabetical order.

### Manual Migration

To apply migrations manually:

```bash
# Linux/macOS
bash scripts/init-db.sh

# Windows
.\scripts\init-db.bat
```

### Migration Files

Located in `migrations/`:

| File | Description | Runs |
|------|-------------|------|
| `001_initial_schema.sql` | Core tables & RLS policies | First |
| `002_add_indexes.sql` | Performance indexes | Second |
| `003_extend_appointments.sql` | Extended appointment fields | Third |

### Creating New Migrations

When adding schema changes:

1. Create a new file: `migrations/004_description.sql`
2. Use incremental numbering
3. Include comments and IF NOT EXISTS checks
4. Test locally before deploying
5. Commit to version control

Example:
```sql
-- Migration: 004_add_feature
-- Description: Add new feature tables
-- Run order: 4

CREATE TABLE IF NOT EXISTS public.new_feature (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_new_feature_created
    ON public.new_feature (created_at DESC);
```

---

## Connecting to the Database

### Using psql CLI

```bash
# Using connection string
psql postgresql://bpms_user@localhost:5432/borderpassport

# With password prompt
psql -h localhost -p 5432 -U bpms_user -d borderpassport

# Using environment
export PGPASSWORD=dev_password_change_me
psql -h localhost -U bpms_user -d borderpassport

# Helper script
bash scripts/db-connect.sh       # Linux/macOS
.\scripts\db-connect.bat          # Windows
```

### Using Adminer Web UI

1. Open browser: http://localhost:8080
2. Login with:
   - **System**: PostgreSQL
   - **Server**: postgres (or localhost)
   - **Username**: bpms_user
   - **Password**: dev_password_change_me
   - **Database**: borderpassport

### Using GUI Tools

**DBeaver** (Free, Cross-platform):
```
Connection: New → PostgreSQL
Host: localhost
Port: 5432
Database: borderpassport
Username: bpms_user
Password: dev_password_change_me
```

**pgAdmin** (Web-based):
```
docker run -p 5050:80 \
  -e 'PGADMIN_DEFAULT_EMAIL=admin@example.com' \
  -e 'PGADMIN_DEFAULT_PASSWORD=admin' \
  dpage/pgadmin4
```

---

## Database Administration

### Common Tasks

#### Check Database Size

```sql
SELECT 
  datname, 
  pg_size_pretty(pg_database_size(datname)) as size
FROM pg_database 
WHERE datname = 'borderpassport';
```

#### List All Tables

```sql
\dt public.*
```

#### View Table Structure

```sql
\d public.applications
```

#### Check Row Counts

```sql
SELECT 
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

#### Create Backup

```bash
# Backup entire database
pg_dump -h localhost -U bpms_user borderpassport > backup.sql

# Backup specific table
pg_dump -h localhost -U bpms_user borderpassport -t applications > applications.sql

# Backup with compression
pg_dump -h localhost -U bpms_user -Fc borderpassport > backup.dump
```

#### Restore Backup

```bash
# Restore from SQL file
psql -h localhost -U bpms_user borderpassport < backup.sql

# Restore from compressed dump
pg_restore -h localhost -U bpms_user -d borderpassport backup.dump
```

#### Monitor Connections

```sql
SELECT 
  datname,
  count(*) as connections,
  max(now() - pg_stat_activity.query_start) as longest_query
FROM pg_stat_activity
GROUP BY datname
ORDER BY count(*) DESC;
```

---

## Troubleshooting

### PostgreSQL Container Won't Start

```bash
# Check logs
docker compose -f docker-compose.db.yml logs postgres

# Remove old container and try again
docker compose -f docker-compose.db.yml down
docker volume rm Borderpassportmanagementsystem_postgres_data
docker compose -f docker-compose.db.yml up -d
```

### Connection Refused Error

```bash
# Check if PostgreSQL is running
docker compose -f docker-compose.db.yml ps

# Start if not running
docker compose -f docker-compose.db.yml up -d

# Check if port 5432 is in use
netstat -tulpn | grep 5432  # Linux/macOS
netstat -ano | findstr :5432 # Windows
```

### Migration Fails

```bash
# Check migration syntax
psql -h localhost -U bpms_user -d borderpassport -f migrations/001_initial_schema.sql

# View error details
docker compose -f docker-compose.db.yml logs postgres

# Reset database (CAUTION: loses all data)
docker compose -f docker-compose.db.yml down
docker volume rm Borderpassportmanagementsystem_postgres_data
docker compose -f docker-compose.db.yml up -d
bash scripts/init-db.sh
```

### Access Denied Error

```bash
# Verify credentials in .env or environment variables
echo $DB_PASSWORD

# Reset user password
sudo -u postgres psql -c "ALTER USER bpms_user WITH PASSWORD 'new_password';"

# Update .env file with new password
```

---

## Production Deployment

### Using Managed PostgreSQL

For production, use managed services:

- **AWS RDS**: Amazon Relational Database Service
- **Azure Database**: For PostgreSQL
- **Google Cloud SQL**: PostgreSQL
- **Heroku Postgres**: Platform-as-a-Service

Benefits:
- Automatic backups
- High availability
- Security patches
- Monitoring & alerts
- Read replicas

### Deployment Checklist

- [ ] Create separate production database user
- [ ] Use strong password (minimum 32 characters)
- [ ] Enable SSL/TLS for connections
- [ ] Configure firewall rules
- [ ] Set up regular backups
- [ ] Enable connection monitoring
- [ ] Configure log shipping
- [ ] Test disaster recovery procedure
- [ ] Document recovery RTO/RPO
- [ ] Set up read replicas for high availability

### Environment Variables for Production

```bash
# .env.production
DB_HOST=prod-postgres.example.com
DB_PORT=5432
DB_NAME=borderpassport_prod
DB_USER=bpms_prod_user
DB_PASSWORD=<strong-random-password-here>
DATABASE_URL=postgresql://bpms_prod_user:****@prod-postgres.example.com:5432/borderpassport_prod
```

### Connection Pooling

For production, use PgBouncer or pgpool:

```bash
# pgBouncer example
docker run -d \
  --name pgbouncer \
  -e DATABASES_HOST=postgres \
  -e DATABASES_PORT=5432 \
  -e DATABASES_USER=bpms_user \
  -e DATABASES_PASSWORD=dev_password_change_me \
  -e DATABASES_DBNAME=borderpassport \
  -p 6432:6432 \
  pgbouncer
```

---

## Performance Optimization

### Index Strategy

Current indexes are created in `002_add_indexes.sql` covering:
- Email searches
- Status filtering
- Date range queries
- Foreign key relationships

### Query Optimization

```sql
-- Enable EXPLAIN ANALYZE to see query plans
EXPLAIN ANALYZE SELECT * FROM applications WHERE status = 'submitted';

-- Check for sequential scans (performance issue)
-- If found, verify indexes exist
```

### Maintenance

```sql
-- Regular maintenance (monthly recommended)
VACUUM ANALYZE;

-- Check and fix corruption
REINDEX DATABASE borderpassport;

-- Monitor autovacuum
SELECT * FROM pg_stat_user_tables 
WHERE n_dead_tup > 10000;
```

---

## Additional Resources

- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)
- [DBeaver Getting Started](https://dbeaver.io/docs/dbeaver/)
- [Docker PostgreSQL Image](https://hub.docker.com/_/postgres/)

---

**Questions?** Check `docs/TROUBLESHOOTING.md` or open an issue on GitHub.

