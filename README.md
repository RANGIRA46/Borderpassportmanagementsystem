
  # Border/Passport Management System

  A comprehensive digital system for managing passport applications, border crossings, biometric data, and citizen services.

  **Original Design**: https://www.figma.com/design/P8zyBnaJnbDPbzCy1f3A83/Border-Passport-Management-System

  ---

  ## ⚡ Quick Start

  ### 1. Install Dependencies
  ```bash
  npm install
  ```

  ### 2. Set Up Database (NEW)
  ```bash
  # Start PostgreSQL
  docker compose -f docker-compose.db.yml up -d

  # Initialize database (Windows)
  .\scripts\init-db.bat

  # Initialize database (Linux/macOS)
  bash scripts/init-db.bat
  ```

  ### 3. Start Development Server
  ```bash
  # Start frontend + backend
  npm run dev:full

  # OR separately:
  npm run dev          # Frontend on http://localhost:5173
  npm run dev:backend  # Backend on http://localhost:3001
  ```

  ---

  ## 📊 Database Setup

  **NEW**: PostgreSQL database with complete schema, migrations, and utilities.

  - **Quick Reference**: See `DATABASE_SETUP.md`
  - **Full Documentation**: See `docs/DATABASE.md`
  - **Verification**: Run `.\scripts\verify-db.bat`

  ### Database Utilities
  ```bash
  .\scripts\init-db.bat        # Initialize database
  .\scripts\db-connect.bat     # Connect via CLI
  .\scripts\backup-db.bat      # Create backup
  .\scripts\verify-db.bat      # Verify setup
  ```

  ### Web UI (Adminer)
  http://localhost:8080
  - Server: `postgres`
  - User: `bpms_user`
  - Password: `dev_password_change_me`
  - Database: `borderpassport`

  ---

  ## 📚 Documentation

  - **Database**: `docs/DATABASE.md` - Comprehensive setup & admin guide
  - **API**: `docs/api/endpoints.md` - REST API documentation
  - **Architecture**: `docs/ARCHITECTURE.md` - System design
  - **Setup**: `docs/SETUP.md` - Environment configuration
  - **Security**: `docs/SECURITY.md` - Security best practices
  - **Deployment**: `docs/DEPLOYMENT.md` - Production deployment

  ---

  ## 🏗️ Project Structure

  ```
  ├── src/                      Frontend (React + TypeScript)
  │   ├── components/           React components
  │   ├── pages/                Page components
  │   ├── api/                  API client
  │   └── styles/               CSS/Tailwind styles
  ├── server/                   Backend API (Hono)
  │   ├── src/                  Server code
  │   └── data/db.json          Local database (dev only)
  ├── migrations/               Database migrations
  ├── docs/                     Documentation
  ├── deployment/               Environment files
  ├── scripts/                  Utility scripts
  ├── docker-compose.db.yml     PostgreSQL setup
  └── vite.config.ts            Frontend build config
  ```

  ---

  ## 🚀 Available Scripts

  | Command | Purpose |
  |---------|---------|
  | `npm run dev` | Start frontend dev server |
  | `npm run dev:backend` | Start backend API server |
  | `npm run dev:full` | Start both frontend + backend |
  | `npm run build` | Build frontend for production |
  | `docker compose -f docker-compose.db.yml up -d` | Start PostgreSQL |
  | `.\scripts\init-db.bat` | Initialize database |
  | `.\scripts\verify-db.bat` | Verify database setup |

  ---

  ## 🔧 Key Features

  - **Passport Management**: Submit, track, and manage applications
  - **Appointments**: Schedule and manage biometric appointments
  - **Border Tracking**: Record entry/exit crossings
  - **Biometric Data**: Capture and store fingerprints/facial recognition
  - **Document Upload**: Submit supporting documents
  - **Admin Dashboard**: Manage applications and users
  - **Responsive Design**: Works on desktop, tablet, mobile

  ---

  ## 🛡️ Security

  - Row Level Security on all database tables
  - Role-based access control (citizen, official, admin)
  - Password hashing with Argon2/Scrypt
  - JWT-based authentication
  - HTTPS ready
  - Environment variable protection

  See `docs/SECURITY.md` for full details.

  ---

  ## 📈 System Requirements

  - **Node.js**: ≥ 18.0
  - **Docker**: ≥ 24.0 (for PostgreSQL)
  - **PostgreSQL**: 14+ (for production)
  - **Modern Browser**: Chrome, Firefox, Safari, Edge

  ---

  ## 🚢 Deployment

  ### Development
  ```bash
  npm install && npm run dev:full
  ```

  ### Production
  ```bash
  docker compose -f docker-compose.prod.yml up -d
  ```

  See `docs/DEPLOYMENT.md` for detailed instructions.

  ---

  ## 📝 License

  This project is part of the Border Passport Management System initiative.

  ---

  ## 🤝 Support

  For questions or issues:
  1. Check the documentation in `docs/`
  2. Review error logs
  3. See troubleshooting guides

  ---

  **Last Updated**: April 2, 2026
  