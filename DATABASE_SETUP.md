# Database Setup - Quick Reference

## TL;DR - Get Started in 2 Minutes

### Using Docker (Easiest)

```bash
# 1. Start database
docker compose -f docker-compose.db.yml up -d

# 2. Run migrations
bash scripts/init-db.sh        # macOS/Linux
.\scripts\init-db.bat           # Windows

# Done! Database is ready at localhost:5432
```

### Access Database

- **Command line**: `bash scripts/db-connect.sh` or `.\scripts\db-connect.bat`
- **Web UI**: Open http://localhost:8080 (Adminer)
  - Server: postgres
  - User: bpms_user
  - Password: dev_password_change_me
  - Database: borderpassport

---

## What Was Created

### Files Created

```
Borderpassportmanagementsystem/
├── docker-compose.db.yml          ← PostgreSQL + Adminer setup
├── deployment/db.env              ← Environment variables
├── docs/DATABASE.md               ← Full documentation
├── scripts/
│   ├── init-db.sh                 ← Initialize (Linux/macOS)
│   ├── init-db.bat                ← Initialize (Windows)
│   ├── backup-db.sh               ← Backup (Linux/macOS)
│   ├── backup-db.bat              ← Backup (Windows)
│   ├── db-connect.sh              ← Connect (Linux/macOS)
│   └── db-connect.bat             ← Connect (Windows)
└── migrations/
    ├── 001_initial_schema.sql     ← Core tables & security
    ├── 002_add_indexes.sql        ← Performance indexes
    ├── 003_extend_appointments.sql ← Extended fields
    └── 004_seed_data.sql          ← Sample data
```

### Database Structure

- **7 Core Tables**: profiles, applications, documents, appointments, application_status_history, border_crossings
- **Row Level Security**: Implemented for all tables
- **Indexes**: Created for all common queries
- **Sample Data**: Test records for development

---

## Next Steps

### 1. Configure Application

Update your `.env` file with:

```bash
DATABASE_URL=postgresql://bpms_user:dev_password_change_me@localhost:5432/borderpassport
DB_HOST=localhost
DB_PORT=5432
DB_NAME=borderpassport
DB_USER=bpms_user
DB_PASSWORD=dev_password_change_me
```

### 2. Install Database Adapter

For Node.js applications, you may need a PostgreSQL driver:

```bash
npm install pg  # Native driver
# OR
npm install @supabase/supabase-js  # If using Supabase
```

### 3. Update Server Connection

Modify your server code to connect to PostgreSQL instead of JSON file.

### 4. Regular Backups

Create backups before major changes:

```bash
bash scripts/backup-db.sh         # Linux/macOS
.\scripts\backup-db.bat            # Windows
```

---

## Common Commands

| Task | Command |
|------|---------|
| **Start Database** | `docker compose -f docker-compose.db.yml up -d` |
| **Stop Database** | `docker compose -f docker-compose.db.yml down` |
| **View Logs** | `docker compose -f docker-compose.db.yml logs postgres` |
| **Connect via CLI** | `bash scripts/db-connect.sh` or `.\scripts\db-connect.bat` |
| **Backup** | `bash scripts/backup-db.sh` or `.\scripts\backup-db.bat` |
| **Restore** | `psql -h localhost -U bpms_user -d borderpassport < backup.sql` |
| **Reset (⚠️)** | `docker volume rm Borderpassportmanagementsystem_postgres_data` |

---

## Troubleshooting

### Database won't start?
```bash
docker compose -f docker-compose.db.yml logs postgres
```

### Port already in use?
```bash
# Change port in docker-compose.db.yml:
# ports:
#   - "5433:5432"  ← Change 5433 to available port
```

### Need to reset everything?
```bash
docker compose -f docker-compose.db.yml down
docker volume rm Borderpassportmanagementsystem_postgres_data
docker compose -f docker-compose.db.yml up -d
bash scripts/init-db.sh
```

---

## Security Notes ⚠️

These are **development credentials only**!

For production:
- [ ] Use strong, randomly-generated passwords
- [ ] Use managed database services (AWS RDS, Azure, etc.)
- [ ] Enable SSL/TLS encryption
- [ ] Set up firewall rules
- [ ] Use separate database user per environment
- [ ] Enable audit logging
- [ ] Regular automated backups
- [ ] Test disaster recovery monthly

---

## Full Documentation

See `docs/DATABASE.md` for:
- Detailed setup instructions
- Schema documentation
- Migration guide
- Database administration
- Performance optimization
- Production deployment

---

**Need help?** Check the docs or see TROUBLESHOOTING.md

