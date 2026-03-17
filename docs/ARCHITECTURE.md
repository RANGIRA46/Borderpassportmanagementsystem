# System Architecture

This document describes the overall architecture of the Border/Passport Management System (BPMS).

---

## 1. System Overview

BPMS is a web-based application that allows citizens to apply for passports, visas, and other travel documents, while enabling immigration officials and administrators to process and track those applications.

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser / Client                      │
│                  React 18 + TypeScript + Vite                │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│                     Supabase Platform                        │
│  ┌───────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Auth Service │  │  Edge Functions  │  │  PostgreSQL  │  │
│  │  (JWT / OAuth)│  │   (Hono + Deno)  │  │  Database    │  │
│  └───────────────┘  └──────────────────┘  └──────────────┘  │
│  ┌───────────────┐  ┌──────────────────┐                    │
│  │  Storage      │  │  Realtime        │                    │
│  │  (documents)  │  │  (notifications) │                    │
│  └───────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture

**Technology:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui

### Directory Structure

```
src/
├── App.tsx                    # Root component, routing
├── main.tsx                   # Application entry point
├── index.css                  # Global styles
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   ├── professional/          # Professional dashboard views
│   ├── multi-agency/          # Multi-agency access components
│   ├── utils/                 # Utility components (themes, i18n, etc.)
│   ├── figma/                 # Design-system image helpers
│   ├── ModernHomePage.tsx     # Citizen-facing home page
│   ├── PassportApplication.tsx
│   ├── VisaApplication.tsx
│   ├── AppointmentBooking.tsx
│   └── ...
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx      # Hono API server (Edge Function)
│           └── kv_store.tsx   # KV-store abstraction
└── utils/
    └── supabase/
        └── info.tsx           # Supabase client setup
```

### Key Design Decisions

- **Component-first:** All UI is broken into small, reusable components.
- **shadcn/ui:** Accessible, headless component library built on Radix UI.
- **Tailwind CSS:** Utility-first CSS for consistent styling without bespoke stylesheets.
- **No global state library:** Component-level state and React context suffice for current complexity.

---

## 3. Backend Architecture

**Technology:** Hono (lightweight web framework), Deno runtime, Supabase Edge Functions

### API Structure

```
/make-server-8ee81f4f/
├── health                              GET
├── applications/
│   ├── passport                        POST
│   ├── visa                            POST
│   ├── permit                          POST
│   ├── citizenship                     POST
│   ├── laissez-passer                  POST
│   ├── refugee                         POST
│   ├── diaspora                        POST
│   ├── status/:refNumber               GET
│   └── user/:email                     GET
├── applications/:refNumber/
│   ├── status                          PUT
│   └── documents                       GET
├── documents                           POST
├── appointments/
│   ├── (create)                        POST
│   └── user/:email                     GET
└── statistics                          GET
```

### Middleware

| Middleware | Purpose |
|-----------|---------|
| `cors()` | Allow cross-origin requests from the frontend |
| `logger()` | HTTP request logging |

---

## 4. Database Schema

All data is stored in **Supabase (PostgreSQL)**. Session/KV data uses the Deno KV store abstraction.

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | Authenticated user accounts (managed by Supabase Auth) |
| `applications` | Passport, visa, permit, etc. applications |
| `application_status_history` | Audit trail of status changes |
| `documents` | Uploaded document metadata |
| `appointments` | Scheduled appointments |
| `border_crossings` | Entry and exit records |
| `audit_logs` | System-wide audit log |

See [`migrations/001_initial_schema.sql`](../migrations/001_initial_schema.sql) for the full DDL.

---

## 5. Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend framework | React 18 | Industry standard, large ecosystem |
| Language | TypeScript | Type safety, better DX |
| Build tool | Vite 6 | Fast HMR, modern ESM-first |
| UI components | shadcn/ui + Radix UI | Accessible, unstyled primitives |
| Styling | Tailwind CSS | Utility-first, consistent design tokens |
| Backend runtime | Deno (Supabase Edge Functions) | Zero cold-start, close to data |
| Backend framework | Hono | Tiny, fast, Deno-compatible |
| Database | PostgreSQL (via Supabase) | Relational, ACID-compliant |
| Authentication | Supabase Auth | JWT + OAuth, RLS policies |
| File storage | Supabase Storage | S3-compatible, CDN-backed |
| Realtime | Supabase Realtime | WebSocket push notifications |
| Charts | Recharts | Composable, declarative |

---

## 6. Design Patterns

### API Design (REST)

- Resources are plural nouns: `/applications`, `/appointments`
- HTTP verbs indicate intent: `GET` read, `POST` create, `PUT` update, `DELETE` remove
- JSON request/response bodies throughout
- Errors follow a consistent shape: `{ "error": "human-readable message" }`

### Component Design

- **Composition over inheritance** — combine small components.
- **Controlled forms** — `react-hook-form` manages form state.
- **Optimistic UI** — show expected state immediately, revert on error.

### Error Handling

- Frontend: React error boundaries + sonner toast notifications.
- Backend: `try/catch` in every route handler, structured error JSON responses.

---

## 7. Data Flow

### Application Submission Flow

```
Citizen fills form → Frontend validates → POST /applications/:type
  → Backend creates record in KV store
  → Returns reference number
  → Frontend shows confirmation
```

### Status Tracking Flow

```
Citizen enters reference number → GET /applications/status/:refNumber
  → Backend reads KV store
  → Returns status history
  → Frontend renders timeline
```

### Authentication Flow

```
User submits credentials → Supabase Auth validates
  → Returns JWT access token
  → Frontend stores token in memory
  → Each API request includes Authorization: Bearer <token>
  → Backend validates token via Supabase Auth SDK
```
