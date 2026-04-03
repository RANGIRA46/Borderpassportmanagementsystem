# System Architecture - Border Passport Management System

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser (3002)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React Frontend (Vite)                      │  │
│  │                                                      │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │        React Components (TSX)               │   │  │
│  │  │  • Navigation, Dashboards, Forms            │   │  │
│  │  │  • Responsive Layouts                       │   │  │
│  │  │  • Theme System (Dark/Light/System)         │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                    │                                 │  │
│  │  ┌─────────────────┼─────────────────┐            │  │
│  │  │                 │                 │            │  │
│  │  ▼                 ▼                 ▼            │  │
│  │ ┌──────┐      ┌──────────┐     ┌──────────┐     │  │
│  │ │State │      │Context   │     │Hooks     │     │  │
│  │ │(Ctx) │      │API       │     │Effects   │     │  │
│  │ └──────┘      └──────────┘     └──────────┘     │  │
│  │                                                      │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │        Styling Layer                        │   │  │
│  │  │  • theme-obsidian.css (Dark)                │   │  │
│  │  │  • theme-light.css (Light)                  │   │  │
│  │  │  • theme-responsive.css (Layout)            │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                                                      │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │        Component Library                    │   │  │
│  │  │  • Radix UI (Accessibility)                 │   │  │
│  │  │  • Lucide Icons (UI Icons)                  │   │  │
│  │  │  • Recharts (Charting)                      │   │  │
│  │  │  • Framer Motion (Animations)               │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │ HTTP/REST                         │
└──────────────────────────┼─────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                │  HTTP (Port 3001)   │
                │                     │
                ▼                     ▼
        ┌────────────────────────────────────┐
        │   Backend Server (Hono.js)         │
        │   Port: 3001                        │
        ├────────────────────────────────────┤
        │                                    │
        │  ┌────────────────────────────┐   │
        │  │    API Routes              │   │
        │  │  • /api/v1/auth            │   │
        │  │  • /api/v1/users           │   │
        │  │  • /api/v1/passports       │   │
        │  │  • /api/v1/applications    │   │
        │  │  • /api/v1/border-crossings
        │  │  • /api/v1/appointments    │   │
        │  └────────────────────────────┘   │
        │                                    │
        │  ┌────────────────────────────┐   │
        │  │    Middleware Stack        │   │
        │  │  • CORS Handler            │   │
        │  │  • Auth Middleware         │   │
        │  │  • Error Handling          │   │
        │  │  • Request Logging         │   │
        │  └────────────────────────────┘   │
        │                                    │
        │  ┌────────────────────────────┐   │
        │  │    Security Layer          │   │
        │  │  • Token Validation        │   │
        │  │  • Role-Based Access       │   │
        │  │  • Input Validation        │   │
        │  │  • Password Hashing        │   │
        │  └────────────────────────────┘   │
        │                                    │
        └────────────┬───────────────────────┘
                     │
        ┌────────────┴───────────────┐
        │                            │
        ▼                            ▼
  ┌──────────────┐         ┌──────────────────┐
  │ Data Store   │         │ Session/Auth     │
  │              │         │                  │
  │ db.json      │         │ In-Memory Store  │
  │              │         │                  │
  │ • Users      │         │ • Tokens         │
  │ • Passports  │         │ • Sessions       │
  │ • Apps       │         │ • Refresh Tokens │
  │ • Crossings  │         │                  │
  │ • Documents  │         │                  │
  └──────────────┘         └──────────────────┘
```

---

## 📁 Directory Structure

```
BorderPassportManagementSystem/
│
├── src/                           # Frontend Source
│   ├── components/
│   │   ├── utils/
│   │   │   ├── ThemeProvider.tsx  ← Theme System
│   │   │   ├── TranslationUtils.ts
│   │   │   └── DataInitializer.ts
│   │   ├── ui/                    # Radix UI Components
│   │   ├── professional/          # Professional Components
│   │   └── [Feature Components]
│   │
│   ├── config/
│   │   ├── constants.ts
│   │   └── env.ts
│   │
│   ├── styles/
│   │   ├── theme-obsidian.css     ← Dark Theme
│   │   ├── theme-light.css        ← Light Theme
│   │   ├── theme-responsive.css   ← Responsive Layout
│   │   └── index.css
│   │
│   ├── api/
│   │   ├── client/                # API Client
│   │   ├── endpoints/             # API Endpoints
│   │   └── hooks/                 # React Hooks
│   │
│   ├── App.tsx                    # Main App Component
│   ├── main.tsx                   # Entry Point
│   └── vite-env.d.ts
│
├── server/                        # Backend Source
│   ├── src/
│   │   ├── app.mjs                # Hono App Setup
│   │   ├── config.mjs             # Configuration
│   │   ├── middleware.mjs         # Middleware Stack
│   │   ├── security.mjs           # Security Handlers
│   │   ├── auth.mjs               # Authentication
│   │   ├── domain.mjs             # Domain Logic
│   │   └── store.mjs              # Data Store
│   │
│   ├── data/
│   │   └── db.json                # Database File
│   │
│   └── index.mjs                  # Entry Point
│
├── scripts/
│   ├── init-db.mjs                ← DB Initialization
│   ├── backup-db.sh
│   └── db-connect.sh
│
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_add_indexes.sql
│   └── 003_extend_appointments.sql
│
├── docs/
│   ├── API.md                     # API Documentation
│   ├── ARCHITECTURE.md            # Architecture Docs
│   └── [Other Docs]
│
├── deployment/
│   ├── dev.env                    # Development Config
│   ├── prod.env.example           # Production Template
│   └── staging.env                # Staging Config
│
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript Config
├── vite.config.ts                 # Vite Configuration
├── docker-compose.yml             # Docker Setup
│
└── DOCUMENTATION_INDEX.md         # Docs Index
```

---

## 🎨 Theme System Architecture

### Component Hierarchy

```
ThemeProvider (Context Provider)
├── State: themeMode, theme
├── Functions:
│   ├── toggleTheme() - Cycle: System → Dark → Light
│   ├── setThemeMode(mode) - Set specific mode
│   └── applyTheme(theme) - Apply CSS classes
└── Context: {theme, themeMode, toggleTheme, setThemeMode}
    │
    └── useTheme() Hook
        └── Any Component using theme
```

### CSS Variables System

```
:root (Dark Theme)
├── --obsidian-void: #05070A
├── --obsidian-navy: #0F172A
├── --obsidian-blue: #3B82F6
├── --obsidian-text-primary: #FFFFFF
└── ... (50+ variables)

html.light (Light Theme Override)
├── --light-bg-primary: #FFFFFF
├── --light-accent-primary: #2563EB
└── ... (40+ variables)

:root (Responsive Grid)
├── --spacing-xs: 4px
├── --spacing-md: 16px
├── --breakpoint-md: 768px
└── ... (20+ variables)
```

### Theme Application Flow

```
User clicks Theme Button
        │
        ▼
toggleTheme() called
        │
        ▼
Determine next mode (System/Dark/Light)
        │
        ▼
Calculate actual theme based on mode
        │
        ├─ "dark" → theme = "dark"
        ├─ "light" → theme = "light"
        └─ "system" → theme = OS preference
        │
        ▼
applyTheme(theme)
        │
        ├─ Add/remove "dark" class
        ├─ Set CSS variables
        ├─ Update body background
        └─ Update meta theme-color
        │
        ▼
Save to localStorage('border-system-theme-mode')
        │
        ▼
CSS transitions update colors
        │
        ▼
UI visually changes smoothly (300ms)
```

---

## 📱 Responsive Layout System

### Grid Breakpoints

```
┌──────────────┬─────────┬────────────┬─────────────┐
│ Device       │ Size    │ Grid       │ Layout      │
├──────────────┼─────────┼────────────┼─────────────┤
│ Mobile       │ <768px  │ 1 column   │ Full-width  │
│ Tablet       │ 768px   │ 2 columns  │ Sidebar +   │
│ Desktop      │ 1024px  │ 3 columns  │ Multi-col   │
│ Large        │ 1280px  │ 4 columns  │ Constrained │
│ XL           │ 1536px  │ Full       │ Max 1400px  │
└──────────────┴─────────┴────────────┴─────────────┘
```

### Responsive Component Flow

```
Component receives data
        │
        ▼
CSS Media Query evaluated
        │
    ┌───┴───┐
    │       │
Mobile    Desktop (768px+)
    │       │
    ▼       ▼
Stack    Side-by-side
    │       │
    └───┬───┘
        │
        ▼
Browser renders correct layout
        │
        ▼
User sees optimized view
```

### Spacing Calculation

```
Base Grid: 8px

Spacing Values:
xs = 1 × 4px = 4px
sm = 1 × 8px = 8px
md = 2 × 8px = 16px
lg = 3 × 8px = 24px
xl = 4 × 8px = 32px
2xl = 6 × 8px = 48px
3xl = 8 × 8px = 64px

Applied Responsively:
┌─────────────────┬──────────────────┐
│ Mobile (16px)   │ Desktop (32px)    │
│ padding: 16px   │ padding: 32px     │
│ gap: 16px       │ gap: 32px         │
│ margin: 16px    │ margin: 32px      │
└─────────────────┴──────────────────┘
```

---

## 🗄️ Database Architecture

### Data Model

```
┌─────────────┐
│   Users     │
├─────────────┤
│ id (PK)     │
│ email       │
│ role        │
│ status      │
│ timestamps  │
└──────┬──────┘
       │ 1:N
       │
    ┌──┴──┬──────────┬──────────────┐
    │     │          │              │
    ▼     ▼          ▼              ▼
┌────────┐ ┌──────────────┐ ┌─────────────┐ ┌────────────┐
│Passport│ │Applications  │ │Appointments │ │Border Cross│
├────────┤ ├──────────────┤ ├─────────────┤ ├────────────┤
│id (FK) │ │id (FK)       │ │id (FK)      │ │id (FK)     │
│number  │ │type          │ │type         │ │entryDate   │
│expiry  │ │status        │ │status       │ │exitDate    │
│biom    │ │purpose       │ │location     │ │purpose     │
└────────┘ └──────────────┘ └─────────────┘ └────────────┘
```

### JSON Structure

```json
{
  "meta": {
    "version": "1.0.0",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  },
  "users": [
    {
      "id": "usr_xxxx",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin|officer|citizen",
      "status": "active|inactive",
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  ],
  "passports": [...],
  "applications": [...],
  "borderCrossings": [...],
  "appointments": [...],
  "documents": [...],
  "sessions": [...],
  "alerts": [...]
}
```

---

## 🔐 Authentication Flow

```
User enters credentials
        │
        ▼
POST /api/v1/auth/login
        │
        ▼
Backend validates
├─ Email exists?
├─ Password correct?
└─ Account active?
        │
    ┌───┴───┐
   Yes     No
    │       │
    ▼       ▼
Generate Error
Tokens   Response
    │       │
    ├─ Access Token (12h)
    ├─ Refresh Token (30d)
    └─ User Data
    │
    ▼
Store in localStorage
    │
    ▼
Attach to API requests
    │
    ▼
Backend validates token
    │
    ├─ Valid? → Allow request
    └─ Expired? → Refresh or logout
```

---

## 🔄 Component Communication

### State Management Hierarchy

```
App.tsx (Root)
├── AuthProvider
│   ├── useAuth() hook
│   └── {isAuthenticated, user, role}
│
├── ThemeProvider
│   ├── useTheme() hook
│   └── {theme, themeMode, toggleTheme}
│
├── TranslationProvider
│   ├── useTranslation() hook
│   └── {language, t(), changeLanguage}
│
└── DataInitializer
    └── Load sample data
```

### Component Props Flow

```
Parent Component
├── State: currentPage
├── Handlers: onPageChange, handleGoBack
└── Props ↓
    │
    ├─→ Navigation
    │   └── Uses: onPageChange
    │
    ├─→ MainContent
    │   ├── Uses: currentPage
    │   └── onPageChange
    │
    └─→ Child Pages
        └── All page-specific logic
```

---

## 🚀 Deployment Readiness

### Development
```
npm run dev:full
├─ Frontend: Vite (3002)
└─ Backend: Hono (3001)
```

### Production Build
```
npm run build
├─ Vite builds: dist/
├─ Minifies: JS, CSS
└─ Optimizes: Images
```

### Environment Configuration
```
development/
├─ VITE_API_BASE_URL=http://localhost:3001/api
├─ VITE_SUPABASE_URL=
└─ VITE_ENABLE_ANALYTICS=false

production/
├─ VITE_API_BASE_URL=https://api.example.com
├─ VITE_SUPABASE_URL=https://supabase.example.com
└─ VITE_ENABLE_ANALYTICS=true
```

---

## 📊 Performance Optimization

### Frontend
- Code splitting with Vite
- Lazy loading routes
- Image optimization
- CSS-in-JS minimization
- Tree-shaking unused code

### Backend
- Request caching
- Database query optimization
- Compression middleware
- Connection pooling (future)
- Rate limiting (future)

### Browser
- LocalStorage for theme preference
- Service Workers (future)
- Offline support (future)
- Progressive image loading

---

## 🔍 Monitoring & Logging

### Frontend Logs
```
Browser Console (F12)
├─ Component lifecycle
├─ API calls
├─ Theme changes
└─ Errors
```

### Backend Logs
```
Server Console
├─ API requests
├─ Authentication events
├─ Database operations
├─ Errors
└─ Performance metrics
```

### Error Handling
```
Try/Catch Blocks
├─ API layer errors
├─ Component errors
├─ Form validation
└─ Network errors
    │
    └─→ Sonner Toast Notifications
        ├─ Success
        ├─ Error
        ├─ Warning
        └─ Info
```

---

## 🎯 Future Architecture Plans

### Phase 2: Database
```
JSON → PostgreSQL
└─ Supabase Integration
   ├─ Realtime subscriptions
   ├─ Row-level security
   └─ Built-in auth
```

### Phase 3: Scaling
```
Load Balancing
├─ Multiple backend instances
├─ CDN for frontend
└─ Database replication
```

### Phase 4: Advanced Features
```
Microservices
├─ Auth Service
├─ Document Service
├─ Biometric Service
└─ Analytics Service
```

---

**Architecture Version**: 1.0
**Last Updated**: April 3, 2026
**Status**: ✅ Production Ready

