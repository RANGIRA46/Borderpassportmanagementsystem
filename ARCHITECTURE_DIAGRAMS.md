# Database System Architecture

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Application                         │
│              (React + TypeScript + Vite)                       │
│                   (Port 5173 - Dev)                            │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ HTTP/JSON
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                  Backend API Server                             │
│                    (Hono + Node.js)                            │
│                   (Port 3001 - Dev)                            │
├─────────────────────────────────────────────────────────────────┤
│  Endpoints:                                                     │
│  ├─ /api/v1/applications - Manage applications                 │
│  ├─ /api/v1/appointments - Book appointments                   │
│  ├─ /api/v1/documents - Upload documents                       │
│  ├─ /api/v1/border - Log crossings                            │
│  └─ /api/v1/admin - Admin operations                          │
└──────────────────────┬──────────────────────────────────────────┘
                       │
            PostgreSQL Connection Pool
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│              PostgreSQL Database                                │
│           (Version 16 - Alpine - Docker)                       │
│               (Port 5432 - Local)                              │
├─────────────────────────────────────────────────────────────────┤
│  Row Level Security (RLS) Policies                             │
│  ├─ Citizens see own data                                      │
│  ├─ Officials/Admins see all                                   │
│  └─ Role-based access control                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         │             │             │
┌────────▼──┐  ┌──────▼───┐  ┌─────▼──────┐
│ Profiles  │  │   Data   │  │  Indexes   │
│ (Users)   │  │ (JSONB)  │  │  & Stats   │
├──────────┤  ├──────────┤  ├────────────┤
│ id (UUID) │  │ form_    │  │ idx_app_   │
│ email     │  │ data     │  │ email      │
│ role      │  │ documents│  │ idx_apps   │
│ created_at│  │ files    │  │ _status    │
└──────────┘  └──────────┘  └────────────┘
         │             │             │
         └─────────────┼─────────────┘
                       │
            Backup/Restore Utilities
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────▼────┐   ┌───▼───┐   ┌─────▼────┐
    │  SQL    │   │Compressed│  │ Timestamped
    │ Backup  │   │ Backup   │  │ Archives
    └─────────┘   └──────────┘  └──────────┘
```

---

## Data Model

### Core Tables and Relationships

```
┌────────────────────────────────────────────────────────┐
│ PROFILES (Users)                                       │
├────────────────────────────────────────────────────────┤
│ id: UUID (PK) ────────┐                                │
│ email: TEXT (UNQ)     │                                │
│ full_name: TEXT       │                                │
│ phone: TEXT           │                                │
│ role: {citizen|official|admin}                         │
│ is_active: BOOLEAN    │                                │
│ created_at, updated_at│                                │
└────────────────────────────────────────────────────────┘
    │             │              │
    │             │              └────────────────┐
    │             │                               │
┌───▼──────────┬──┴─────────────┬────────────────┼───┐
│              │                │                │   │
│              │                │                │   │
▼              ▼                ▼                ▼   ▼

┌─────────────────────────────────────────────────────────┐
│ APPLICATIONS                                            │
├─────────────────────────────────────────────────────────┤
│ id: TEXT (PK)                                           │
│ type: {passport|visa|permit|citizenship|...}          │
│ status: {submitted|under_review|approved|...}         │
│ applicant_id: UUID (FK) ──────────┐                    │
│ applicant_email: TEXT             │                    │
│ form_data: JSONB                  │                    │
│ submitted_at: TIMESTAMPTZ         │                    │
└─────────────────────────────────────────────────────────┘
         │ (1:N)         (1:N)
         │       ┌───────────┐
         │       │           │
┌────────▼──────────────┐ ┌──▼──────────────────────┐
│ APPLICATION_STATUS_   │ │ DOCUMENTS               │
│ HISTORY               │ │                         │
├──────────────────────┤ ├─────────────────────────┤
│ id: UUID (PK)         │ │ id: TEXT (PK)           │
│ application_id: FK    │ │ application_id: FK      │
│ status: TEXT          │ │ document_type: TEXT     │
│ note: TEXT            │ │ file_name: TEXT         │
│ changed_by: UUID (FK) │ │ storage_path: TEXT      │
│ changed_at: TSZ       │ │ status: {uploaded|...}  │
└──────────────────────┘ └─────────────────────────┘
         │
         └────────────┬───────────────────────────┐
                      │                           │
┌─────────────────────▼────────┐   ┌──────────────▼──────┐
│ APPOINTMENTS                  │   │ BORDER_CROSSINGS   │
├───────────────────────────────┤   ├────────────────────┤
│ id: TEXT (PK)                 │   │ id: UUID (PK)      │
│ applicant_id: UUID (FK)       │   │ document_number    │
│ applicant_email: TEXT         │   │ traveller_name     │
│ service_type: TEXT            │   │ crossing_type      │
│ location: TEXT                │   │ border_post        │
│ appointment_date: DATE        │   │ recorded_by: UUID  │
│ appointment_time: TEXT        │   │ crossing_time: TSZ │
│ status: {scheduled|...}       │   │                    │
│ confirmation_code: UNQ        │   │                    │
└───────────────────────────────┘   └────────────────────┘
```

---

## Migration Execution Order

```
Application Startup
       │
       │
       ▼
┌──────────────────────────────────────────┐
│ Docker Compose Starts PostgreSQL         │
│ (postgres:16-alpine)                     │
└──────────────────────────────────────────┘
       │
       │
       ▼
┌──────────────────────────────────────────┐
│ 001_initial_schema.sql                   │
│ ├─ CREATE EXTENSION "uuid-ossp"          │
│ ├─ CREATE TABLE profiles                 │
│ ├─ CREATE TABLE applications             │
│ ├─ CREATE TABLE documents                │
│ ├─ CREATE TABLE appointments             │
│ ├─ CREATE TABLE application_status...    │
│ ├─ CREATE TABLE border_crossings         │
│ └─ ENABLE ROW LEVEL SECURITY             │
│    + CREATE POLICIES                     │
└──────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ 002_add_indexes.sql                      │
│ ├─ idx_applications_email                │
│ ├─ idx_applications_status               │
│ ├─ idx_appointments_email                │
│ ├─ idx_appointments_date                 │
│ ├─ idx_documents_application_id          │
│ └─ [+ 5 more performance indexes]        │
└──────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ 003_extend_appointments.sql              │
│ ├─ ADD COLUMN location_name              │
│ ├─ ADD COLUMN phone                      │
│ ├─ ADD COLUMN first_name                 │
│ ├─ ADD COLUMN confirmation_code          │
│ ├─ ADD COLUMN completed_at               │
│ └─ CREATE INDEX confirmation_code        │
└──────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ 004_seed_data.sql                        │
│ ├─ INSERT 3 profiles (admin, officer, ...) │
│ ├─ INSERT 3 applications                 │
│ ├─ INSERT 5 status history records       │
│ ├─ INSERT 3 appointments                 │
│ └─ INSERT 2 border crossings             │
└──────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ Database Ready! ✅                       │
│ All tables created                       │
│ All indexes created                      │
│ Row Level Security enabled               │
│ Sample data loaded                       │
│ Ready for development                    │
└──────────────────────────────────────────┘
```

---

## Row Level Security (RLS) Policy Model

```
User Login (via JWT Token)
       │
       │ auth.uid() = UUID
       │
       ▼
┌─────────────────────────────────────────────┐
│ Check User Role from profiles.role          │
└─────────────────────────────────────────────┘
       │
   ┌───┴───┬───────────┐
   │       │           │
   ▼       ▼           ▼
CITIZEN OFFICIAL    ADMIN
   │       │           │
   │       │           │
┌──▼───┐┌──▼────┐ ┌──▼─────┐
│Can   ││Can    │ │Can     │
│view: ││view:  │ │view:   │
│      ││       │ │        │
│- Own │├─ All  │ │- All   │
│ apps ││ apps  │ │ apps   │
│- Own │├─ All  │ │- All   │
│ docs ││ docs  │ │ docs   │
│- Own │├─ All  │ │- All   │
│ appt ││ appt  │ │ appt   │
│      │└─ Logs │ │- Logs  │
│      │        │ │- Admin │
│      │        │ │ panel  │
└──────┘└────────┘ └────────┘
```

---

## Database Backup & Recovery Workflow

```
Regular Operations
       │
       │ (Weekly)
       │
       ▼
┌──────────────────────────────────┐
│ backup-db.sh/bat                 │
│                                  │
│ pg_dump -Fc (Compressed)         │
│ pg_dump -Fp (SQL)                │
└──────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ .backup/                         │
│ ├─ borderpassport_20260402_...   │
│ │  .dump (Compressed, smaller)   │
│ └─ borderpassport_20260402_...   │
│    .sql (Plain text, readable)   │
└──────────────────────────────────┘
       │
       │ (If disaster)
       │
       ▼
┌──────────────────────────────────┐
│ Recovery Options:                │
│                                  │
│ pg_restore backup.dump      OR   │
│ psql -f backup.sql              │
└──────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Database Restored ✅             │
└──────────────────────────────────┘
```

---

## Utility Scripts Flow

```
┌─────────────────────────────────────────────────┐
│ Project Root                                    │
└─────────────────────────────────────────────────┘
    │
    └─── scripts/
        │
        ├─ init-db.sh / init-db.bat
        │   │
        │   ├─ 1. Check psql available
        │   ├─ 2. Wait for PostgreSQL ready
        │   ├─ 3. Create database
        │   ├─ 4. Run migrations (001-004)
        │   └─ 5. Verify success
        │
        ├─ db-connect.sh / db-connect.bat
        │   │
        │   └─ Connect via psql CLI
        │
        ├─ backup-db.sh / backup-db.bat
        │   │
        │   ├─ Create SQL backup
        │   ├─ Create Compressed backup
        │   └─ Save to .backup/
        │
        └─ verify-db.sh / verify-db.bat
            │
            ├─ Check 6 core tables exist
            ├─ Check 10+ indexes exist
            ├─ Check RLS policies enabled
            ├─ Count records
            ├─ Show database size
            └─ Report summary
```

---

## Directory Structure

```
Borderpassportmanagementsystem/
│
├── 📄 docker-compose.db.yml          ← PostgreSQL + Adminer setup
│
├── 📁 deployment/
│   └── db.env                        ← Database configuration
│
├── 📁 migrations/
│   ├── 001_initial_schema.sql        ← Core tables & security
│   ├── 002_add_indexes.sql           ← Performance indexes
│   ├── 003_extend_appointments.sql   ← Extended fields
│   └── 004_seed_data.sql             ← Sample data
│
├── 📁 scripts/
│   ├── init-db.sh & init-db.bat      ← Initialize DB
│   ├── db-connect.sh & db-connect.bat ← Connect CLI
│   ├── backup-db.sh & backup-db.bat   ← Create backups
│   └── verify-db.sh & verify-db.bat   ← Verify setup
│
├── 📁 docs/
│   ├── DATABASE.md                   ← Comprehensive guide (400+ lines)
│   ├── SECURITY.md                   ← Security best practices
│   ├── DEPLOYMENT.md                 ← Production deployment
│   └── api/endpoints.md              ← API documentation
│
├── 📁 server/
│   ├── index.mjs                     ← Entry point
│   └── src/
│       ├── app.mjs                   ← Hono app setup
│       ├── config.mjs                ← Configuration
│       ├── middleware.mjs            ← Auth middleware
│       └── security.mjs              ← Security utils
│
├── 📁 src/
│   ├── components/                   ← React components
│   ├── api/
│   │   ├── client/                   ← API client
│   │   ├── endpoints/                ← Endpoint definitions
│   │   └── hooks/                    ← React hooks
│   └── styles/                       ← CSS/Tailwind
│
├── 📄 DATABASE_SETUP.md              ← Quick reference
├── 📄 DB_SETUP_COMPLETE.md           ← Setup report
├── 📄 SETUP_CHECKLIST.md             ← Implementation checklist
├── 📄 README.md                      ← Project overview (updated)
│
└── 🐳 Docker Infrastructure
    ├── postgres:16-alpine            ← PostgreSQL container
    ├── adminer:latest                ← Admin UI (port 8080)
    └── postgres_data volume          ← Data persistence
```

---

## Timeline: From Empty Project to Ready Database

```
T=0:00   START
   │
   ├─ 0:00-0:05  - Copy docker-compose.db.yml
   │
   ├─ 0:05-0:10  - docker compose up -d
   │              (PostgreSQL container starts)
   │
   ├─ 0:10-0:20  - run init-db.bat
   │              ├─ Wait for PostgreSQL ready
   │              ├─ Create database
   │              ├─ Run 4 migrations (01-04)
   │              └─ Verify success
   │
   ├─ 0:20-0:30  - run verify-db.bat
   │              ├─ Check 6 tables created
   │              ├─ Check 10+ indexes
   │              ├─ Check RLS policies
   │              └─ Show sample data
   │
   ├─ 0:30-0:40  - Review documentation
   │              ├─ Read DATABASE_SETUP.md
   │              ├─ Review DATABASE.md
   │              └─ Check SETUP_CHECKLIST.md
   │
   └─ 0:40       DONE! ✅ Ready for development
```

---

## Connection Paths

```
Your Application Code
       │
       ├─────────────────────────────────────┐
       │                                     │
       ▼                                     ▼
   psql CLI                         PostgreSQL Driver
   (shell commands)                 (pg, sequelize, etc)
       │                                     │
       │          ┌────────────────────────┬─┴──────┐
       │          │                        │        │
       │          ▼                        ▼        ▼
       └─────► postgres:5432 ◄────────┐ Connection Pool
               (Docker Container)    │ (pgBouncer optional)
                    │                └─────────────┘
                    │
            ┌───────┴────────┐
            │                │
            ▼                ▼
        Data at Rest    Log Files
        (database.db)   (postgres.log)
```

---

**This architecture provides:**
✅ Secure multi-user access with RLS  
✅ Fast queries with optimized indexes  
✅ Reliable backups and recovery  
✅ Easy development with sample data  
✅ Clear separation of concerns  
✅ Production-ready schema design  

🎉 Ready to build your Border Passport Management System!

