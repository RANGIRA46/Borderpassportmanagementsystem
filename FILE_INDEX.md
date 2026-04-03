# 📚 Complete File Index - Border Passport Management System

## 🎯 Quick Navigation

### 🚀 START HERE
- **QUICKSTART.md** - Get running in 5 minutes
- **IMPLEMENTATION_SUMMARY.md** - Complete feature list

### 📖 DOCUMENTATION
- **ARCHITECTURE_COMPLETE.md** - System architecture deep dive
- **DEVELOPER_CHEATSHEET.md** - Quick reference for devs
- **README.md** - Project overview

### 🗂️ PROJECT STRUCTURE

---

## 📍 Documentation Files

### For Users & Admins
```
├─ QUICKSTART.md                      ← Start here!
│  └─ How to run the system
│  └─ Default credentials
│  └─ What's new in this version
│
├─ IMPLEMENTATION_SUMMARY.md
│  └─ Complete feature overview
│  └─ Design system details
│  └─ Database schema
│  └─ Troubleshooting
│
└─ README.md
   └─ Project description
   └─ Setup instructions
   └─ Feature list
```

### For Developers
```
├─ DEVELOPER_CHEATSHEET.md            ← Bookmark this!
│  └─ Quick commands
│  └─ Code snippets
│  └─ Component examples
│  └─ API integration
│  └─ Debugging tips
│
├─ ARCHITECTURE_COMPLETE.md
│  └─ System architecture diagrams
│  └─ Component hierarchy
│  └─ Database structure
│  └─ Authentication flow
│  └─ Deployment strategy
│
├─ docs/API.md
│  └─ API endpoints
│  └─ Request/response formats
│  └─ Authentication headers
│  └─ Error codes
│
├─ docs/DATABASE.md
│  └─ Database schema
│  └─ Table relationships
│  └─ Query examples
│  └─ Migration guide
│
└─ docs/ARCHITECTURE.md
   └─ System design
   └─ Component structure
   └─ Data flow
```

### For Operations
```
├─ docs/DEPLOYMENT.md
│  └─ Production setup
│  └─ Environment config
│  └─ Docker setup
│  └─ Scaling guide
│
├─ docs/TROUBLESHOOTING.md
│  └─ Common issues
│  └─ Debug procedures
│  └─ Performance tips
│  └─ Recovery steps
│
└─ SETUP_CHECKLIST.md
   └─ Pre-launch checklist
   └─ Configuration items
   └─ Testing procedures
```

---

## 💻 Source Code Files

### Frontend (React/TypeScript)

#### Core Application
```
src/
├─ main.tsx                          ← Entry point (imports all themes)
├─ App.tsx                           ← Main component with routing
├─ index.css                         ← Global styles
├─ vite-env.d.ts                     ← TypeScript definitions
└─ index.html                        ← HTML template
```

#### Theme System (NEW)
```
src/
├─ theme-obsidian.css               ← Dark theme (Midnight Obsidian)
├─ theme-light.css                  ← Light theme (NEW - Professional)
└─ theme-responsive.css             ← Responsive layout system (NEW)
```

#### Components
```
src/components/
├─ utils/
│  ├─ ThemeProvider.tsx              ← Theme system (ENHANCED)
│  │  └─ useTheme() hook
│  │  └─ ThemeToggle component
│  │  └─ Dark/Light/System modes
│  ├─ LanguageSelector.tsx
│  ├─ TranslationUtils.ts
│  ├─ DataInitializer.tsx
│  ├─ NavigationUtils.tsx
│  └─ TranslationProvider.tsx
│
├─ ui/
│  ├─ button.tsx                    ← Button component
│  ├─ card.tsx                       ← Card component
│  ├─ alert.tsx                      ← Alert component
│  ├─ dialog.tsx                     ← Dialog component
│  ├─ input.tsx                      ← Input component
│  └─ [Other Radix UI components]
│
├─ professional/
│  ├─ OfficerDashboard.tsx
│  ├─ ProfessionalNavigation.tsx
│  ├─ ProfessionalAdminDashboard.tsx
│  └─ ProfessionalStatusTracker.tsx
│
├─ Navigation.tsx                    ← Main navigation
├─ AdminNavigation.tsx               ← Admin navigation
├─ HomePage.tsx                      ← Home page
├─ AdminHomePage.tsx                 ← Admin home
├─ ModernHomePage.tsx                ← Modern home
├─ StatusChecker.tsx                 ← Status checking
├─ BorderRecords.tsx                 ← Border records
├─ AdminPanel.tsx                    ← Admin panel
├─ BiometricEnrollment.tsx           ← Biometrics
├─ EntryExitLogging.tsx              ← Entry/exit logs
├─ IdentityVerification.tsx          ← Identity verification
├─ TravelerDashboard.tsx             ← Traveler dashboard
├─ RiskAssessment.tsx                ← Risk assessment
├─ AnalyticsDashboard.tsx            ← Analytics
├─ Chatbot.tsx                       ← Chat support
├─ PaymentCenter.tsx                 ← Payments
├─ Chatbot.tsx                       ← AI chatbot
├─ UserAuth.tsx                      ← Authentication
└─ [20+ other components]
```

#### Configuration
```
src/config/
├─ constants.ts                      ← App constants
├─ env.ts                            ← Environment variables
└─ [Other config files]
```

#### Services & Hooks
```
src/
├─ api/
│  ├─ client/                        ← API client setup
│  ├─ endpoints/                     ← Endpoint definitions
│  └─ hooks/                         ← React hooks
├─ services/                         ← Business logic
├─ middleware/                       ← Custom middleware
├─ utils/                            ← Utility functions
├─ features/                         ← Feature modules
├─ guidelines/                       ← UI guidelines
└─ supabase/                         ← Supabase integration
```

### Backend (Node.js/Hono)

#### Server
```
server/
├─ index.mjs                         ← Server entry point
│  └─ Starts Hono app on port 3001
│
└─ src/
   ├─ app.mjs                        ← Hono app setup
   │  └─ Routes configuration
   │  └─ Middleware setup
   │
   ├─ config.mjs                     ← Configuration
   │  └─ Port settings
   │  └─ Default credentials
   │  └─ File paths
   │
   ├─ middleware.mjs                 ← Middleware stack
   │  └─ CORS handling
   │  └─ Error handling
   │  └─ Request logging
   │
   ├─ security.mjs                   ← Security handlers
   │  └─ Token validation
   │  └─ Password hashing
   │  └─ CSRF protection
   │
   ├─ auth.mjs                       ← Authentication
   │  └─ Login handler
   │  └─ Token generation
   │  └─ Session management
   │
   ├─ domain.mjs                     ← Domain logic
   │  └─ User operations
   │  └─ Passport operations
   │  └─ Application processing
   │
   ├─ events.mjs                     ← Event system
   │  └─ Event handlers
   │  └─ Logging events
   │
   ├─ audit.mjs                      ← Audit logging
   │  └─ Track changes
   │  └─ User activity
   │
   └─ store.mjs                      ← Data persistence
      └─ File I/O
      └─ Data serialization
```

#### Data
```
server/data/
└─ db.json                           ← Main database file
   ├─ meta (version, timestamps)
   ├─ users (5 users)
   ├─ passports (3 passports)
   ├─ applications (3 apps)
   ├─ borderCrossings (3 logs)
   ├─ appointments (3 appointments)
   ├─ documents (2 documents)
   ├─ alerts (2 alerts)
   ├─ sessions (auth)
   └─ settings (system settings)
```

### Database & Migrations

```
migrations/
├─ 001_initial_schema.sql            ← Core tables
├─ 002_add_indexes.sql               ← Performance indexes
├─ 003_extend_appointments.sql       ← Extended fields
└─ 004_seed_data.sql                 ← Sample data
```

### Scripts

```
scripts/
├─ init-db.mjs                       ← Database initialization (NEW)
│  └─ Creates sample data
│  └─ Initializes structure
│  └─ Validates data
│
├─ backup-db.sh                      ← Linux/macOS backup
├─ backup-db.bat                     ← Windows backup
├─ db-connect.sh                     ← Linux/macOS connect
├─ db-connect.bat                    ← Windows connect
├─ init-db.sh                        ← Linux/macOS init
└─ init-db.bat                       ← Windows init
```

### Configuration Files

```
Root/
├─ package.json                      ← Dependencies & scripts
│  ├─ npm run dev              → Start frontend
│  ├─ npm run dev:backend      → Start backend
│  ├─ npm run dev:full         → Start both
│  ├─ npm run db:init          → Init database
│  └─ npm run build            → Build for prod
│
├─ tsconfig.json                     ← TypeScript config
├─ tsconfig.node.json                ← Node TypeScript config
├─ vite.config.ts                    ← Vite config
│  ├─ Dev server settings
│  ├─ Build settings
│  └─ Plugin configuration
│
├─ docker-compose.yml                ← Docker services (prod)
├─ docker-compose.db.yml             ← Database only (dev)
├─ docker-compose.prod.yml           ← Production setup
├─ Dockerfile                        ← Container definition
│
└─ index.html                        ← HTML entry point
```

### Environment Configuration

```
deployment/
├─ dev.env                           ← Development
│  ├─ VITE_API_BASE_URL=localhost:3001
│  ├─ VITE_ENABLE_ANALYTICS=false
│  └─ VITE_SUPABASE_URL=(empty)
│
├─ staging.env                       ← Staging
│  ├─ VITE_API_BASE_URL=staging-api.example.com
│  ├─ VITE_ENABLE_ANALYTICS=true
│  └─ VITE_SUPABASE_URL=(configured)
│
├─ prod.env.example                  ← Production template
│  ├─ VITE_API_BASE_URL=api.example.com
│  ├─ VITE_ENABLE_ANALYTICS=true
│  └─ VITE_SUPABASE_URL=(production)
│
└─ db.env                            ← Database config
   ├─ DATABASE_URL=postgresql://...
   ├─ DB_HOST=localhost
   ├─ DB_PORT=5432
   └─ DB_USER=bpms_user
```

---

## 📊 Documentation Files by Topic

### Authentication & Security
```
├─ DEVELOPER_CHEATSHEET.md → "Check Auth Status" section
├─ docs/API.md → Authentication endpoints
├─ docs/SECURITY.md → Security best practices
├─ server/src/security.mjs → Implementation
└─ server/src/auth.mjs → Auth handlers
```

### Theme System
```
├─ QUICKSTART.md → "Test the Theme Toggle" section
├─ IMPLEMENTATION_SUMMARY.md → "Enhanced Theme System"
├─ ARCHITECTURE_COMPLETE.md → "Theme System Architecture"
├─ DEVELOPER_CHEATSHEET.md → "Theme Usage"
├─ src/theme-obsidian.css → Dark theme styles
├─ src/theme-light.css → Light theme styles
└─ src/components/utils/ThemeProvider.tsx → Implementation
```

### Responsive Design
```
├─ QUICKSTART.md → "Test Responsive Layout"
├─ IMPLEMENTATION_SUMMARY.md → "Responsive Layout System"
├─ ARCHITECTURE_COMPLETE.md → "Responsive Layout System"
├─ DEVELOPER_CHEATSHEET.md → "Responsive Utilities"
└─ src/theme-responsive.css → Responsive classes
```

### Database
```
├─ QUICKSTART.md → "Sample Data Available"
├─ IMPLEMENTATION_SUMMARY.md → "Database System"
├─ ARCHITECTURE_COMPLETE.md → "Database Architecture"
├─ docs/DATABASE.md → Schema details
├─ scripts/init-db.mjs → Initialization
└─ server/data/db.json → Actual database
```

### API Integration
```
├─ docs/API.md → Endpoints list
├─ docs/api/openapi.yaml → OpenAPI spec
├─ docs/api/endpoints.md → Detailed endpoints
├─ DEVELOPER_CHEATSHEET.md → "API Integration"
└─ server/src/app.mjs → Route definitions
```

### Deployment
```
├─ docs/DEPLOYMENT.md → Full deployment guide
├─ docs/infrastructure/docker.md → Docker guide
├─ docker-compose.yml → Docker services
└─ deployment/ → Config files
```

### Troubleshooting
```
├─ QUICKSTART.md → Common issues section
├─ docs/TROUBLESHOOTING.md → Detailed solutions
├─ IMPLEMENTATION_SUMMARY.md → Troubleshooting guide
└─ DEVELOPER_CHEATSHEET.md → Quick fixes
```

---

## 🔗 File Relationships

### How Files Connect

```
User Browser
    ↓
index.html (loads main.tsx)
    ↓
main.tsx (imports themes)
    ├─→ theme-obsidian.css
    ├─→ theme-light.css
    └─→ theme-responsive.css
    ↓
App.tsx (routing)
    ├─→ Navigation.tsx
    ├─→ ThemeProvider.tsx
    │   └─→ useTheme() hook
    ├─→ AuthProvider.tsx
    │   └─→ useAuth() hook
    └─→ [Feature Components]
        └─→ UI Components from src/components/ui/
            ├─→ Radix UI primitives
            ├─→ Lucide icons
            └─→ Framer Motion animations

API Calls
    ↓
server/index.mjs
    ↓
server/src/app.mjs
    ├─→ Routes
    ├─→ Middleware
    ├─→ Security handlers
    └─→ store.mjs (db.json)
```

---

## 📋 File Checklist

### Essential Files
- [x] package.json - Dependencies configured
- [x] tsconfig.json - TypeScript setup
- [x] vite.config.ts - Build config
- [x] index.html - Entry point
- [x] src/main.tsx - App bootstrap
- [x] src/App.tsx - Main component
- [x] server/index.mjs - Backend
- [x] server/data/db.json - Database

### Theme Files
- [x] src/theme-obsidian.css - Dark
- [x] src/theme-light.css - Light
- [x] src/theme-responsive.css - Responsive
- [x] src/components/utils/ThemeProvider.tsx - Logic

### Documentation
- [x] QUICKSTART.md - Start here
- [x] IMPLEMENTATION_SUMMARY.md - Features
- [x] ARCHITECTURE_COMPLETE.md - Design
- [x] DEVELOPER_CHEATSHEET.md - Reference
- [x] docs/API.md - Endpoints

### Scripts
- [x] scripts/init-db.mjs - DB init
- [x] package.json scripts - npm commands

---

## 🎯 How to Use This Index

### I want to...

**...start the system**
→ Read: QUICKSTART.md

**...understand the architecture**
→ Read: ARCHITECTURE_COMPLETE.md

**...implement a feature**
→ Read: DEVELOPER_CHEATSHEET.md

**...customize themes**
→ Edit: src/theme-*.css files

**...add a database table**
→ Edit: server/data/db.json

**...change the API**
→ Edit: server/src/app.mjs

**...troubleshoot an issue**
→ Read: docs/TROUBLESHOOTING.md

**...deploy to production**
→ Read: docs/DEPLOYMENT.md

**...understand the database**
→ Read: docs/DATABASE.md

---

## 📞 File Support Matrix

| File | Purpose | Edit? | Version | Status |
|------|---------|-------|---------|--------|
| QUICKSTART.md | Quick start | No | 1.0 | ✅ |
| IMPLEMENTATION_SUMMARY.md | Feature overview | No | 1.0 | ✅ |
| ARCHITECTURE_COMPLETE.md | Architecture | No | 1.0 | ✅ |
| DEVELOPER_CHEATSHEET.md | Dev reference | No | 1.0 | ✅ |
| src/theme-obsidian.css | Dark theme | Yes | 1.0 | ✅ |
| src/theme-light.css | Light theme | Yes | 1.0 | ✅ |
| src/theme-responsive.css | Responsive | Yes | 1.0 | ✅ |
| server/data/db.json | Database | Yes | 1.0 | ✅ |
| package.json | Dependencies | Yes | 1.0 | ✅ |

---

## 🎉 Summary

**Total Documentation Files**: 4 main guides
**Total Source Files**: 50+ component files
**Total Configuration Files**: 10+ config files
**Total Script Files**: 8 utility scripts

**Key Entry Points**:
1. **QUICKSTART.md** - For running the system
2. **DEVELOPER_CHEATSHEET.md** - For coding
3. **ARCHITECTURE_COMPLETE.md** - For understanding

---

**Index Version**: 1.0
**Last Updated**: April 3, 2026
**Status**: ✅ Complete

