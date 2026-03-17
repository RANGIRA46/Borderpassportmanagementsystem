# Border Passport Management System – Backend API

A production-ready REST API built with **Hono.js**, **TypeScript**, **Supabase** (PostgreSQL), and **JWT** authentication.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Hono.js](https://hono.dev) v4 |
| Language | TypeScript (strict) |
| Database | [Supabase](https://supabase.com) (PostgreSQL) |
| Authentication | JWT via [jose](https://github.com/panva/jose) v5 |
| Validation | [Zod](https://zod.dev) v3 |
| Password Hashing | Web Crypto PBKDF2 (100k iterations, SHA-256) |

## Getting Started

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Fill in your Supabase credentials and JWT secret
```

### 3. Run database migrations

In your Supabase project's SQL editor, run the contents of `migrations/init.sql`.

### 4. Start the development server

```bash
npm run dev
# Server starts on http://localhost:3001
```

### 5. Build for production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `SUPABASE_URL` | Supabase project URL | required |
| `SUPABASE_ANON_KEY` | Supabase anon/public key | required |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side) | required |
| `JWT_SECRET` | Secret key for signing JWT tokens | required |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment (`development`/`production`) | `development` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

## API Endpoints

### Authentication
| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |
| GET | `/api/auth/profile` | Get current user profile | ✅ |
| PATCH | `/api/auth/profile` | Update profile | ✅ |

### Passports
| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/passports` | List passports (role-filtered) | ✅ |
| POST | `/api/passports` | Submit passport application | ✅ |
| GET | `/api/passports/:id` | Get single passport | ✅ |
| PATCH | `/api/passports/:id` | Update passport | ✅ |
| DELETE | `/api/passports/:id` | Delete passport | ✅ |

### Border Crossings
| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/border-crossings` | List crossings (role-filtered) | ✅ |
| POST | `/api/border-crossings` | Record a border crossing | ✅ |
| GET | `/api/border-crossings/:id` | Get single crossing | ✅ |
| PATCH | `/api/border-crossings/:id` | Update crossing status | ✅ Official/Admin |
| GET | `/api/border-crossings/stats` | Crossing statistics | ✅ Official/Admin |

### Appointments
| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/appointments` | List appointments | ✅ |
| POST | `/api/appointments` | Schedule appointment | ✅ |
| GET | `/api/appointments/:id` | Get appointment details | ✅ |
| PATCH | `/api/appointments/:id` | Update appointment | ✅ |
| DELETE | `/api/appointments/:id` | Cancel appointment | ✅ |
| GET | `/api/appointments/slots` | Get available time slots | ✅ |

### Dashboard & Analytics
| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/dashboard/stats` | Statistics (citizens get own stats; officials/admins get full stats) | ✅ |
| GET | `/api/dashboard/passport-stats` | Passport application statistics | ✅ Official/Admin |
| GET | `/api/dashboard/crossing-stats` | Border crossing analytics | ✅ Official/Admin |

## Role-Based Access Control

| Role | Capabilities |
|---|---|
| `citizen` | Own passports, own appointments, own border crossings |
| `official` | View all records, update crossing status, view stats |
| `admin` | Full access including user management, all statistics |

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database and environment configuration
│   ├── middleware/       # Auth, CORS, error handling, validation
│   ├── services/         # Business logic layer
│   ├── controllers/      # HTTP request handlers
│   ├── models/           # TypeScript types and Zod schemas
│   ├── routes/           # Route definitions
│   ├── utils/            # Logger, JWT, crypto helpers
│   └── index.ts          # Application entry point
├── migrations/
│   └── init.sql          # Database schema
├── .env.example
├── package.json
└── tsconfig.json
```
