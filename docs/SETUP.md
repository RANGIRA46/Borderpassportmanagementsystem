# Setup & Installation Guide

This guide explains how to set up the Border/Passport Management System (BPMS) for local development.

---

## 1. Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | ≥ 18.x | [nodejs.org](https://nodejs.org) |
| npm | ≥ 9.x | Bundled with Node.js |
| Git | any recent | [git-scm.com](https://git-scm.com) |
| Supabase account | — | [supabase.com](https://supabase.com) (free tier available) |
| Docker *(optional)* | ≥ 24.x | Required only for containerised setup |

---

## 2. Clone the Repository

```bash
git clone https://github.com/RANGIRA46/Borderpassportmanagementsystem.git
cd Borderpassportmanagementsystem
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Open `.env.local` and set each variable (see [Environment Variables](#5-environment-variables) below).

---

## 5. Environment Variables

### Frontend (Vite)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | `eyJhb...` |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/make-server-8ee81f4f` |
| `VITE_APP_ENV` | Application environment | `development` |

### Backend (Supabase Edge Functions / Deno)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role secret key |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `CORS_ORIGIN` | Allowed CORS origin (e.g. `http://localhost:3000`) |

### Email / Notifications *(optional)*

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port (default `587`) |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | From address for sent emails |

### SMS *(optional)*

| Variable | Description |
|----------|-------------|
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_FROM_NUMBER` | Twilio phone number |

---

## 6. Supabase Setup

### 6.1 Create a Project

1. Log in to [supabase.com](https://supabase.com).
2. Click **New Project** and choose an organisation.
3. Enter a name, database password, and region, then click **Create new project**.
4. Copy the **Project URL** and **anon key** from **Settings → API**.

### 6.2 Run Database Migrations

Once you have the Supabase project URL and service-role key, run the migrations:

```bash
# Using the Supabase CLI
supabase db push

# Or manually run each SQL file in order:
# migrations/001_initial_schema.sql
# migrations/002_add_indexes.sql
# migrations/003_add_audit_tables.sql
```

See [`migrations/`](../migrations/) for details.

### 6.3 Deploy the Edge Function

```bash
supabase functions deploy server --project-ref <your-project-ref>
```

---

## 7. Start the Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:3000**.

---

## 8. Accessing the Application

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Frontend application |
| `https://<project>.supabase.co/functions/v1/server` | Backend API (Edge Function) |

---

## 9. Development Workflow

```bash
# Start dev server with hot-reload
npm run dev

# Type-check without building
npx tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 10. Common Issues & Solutions

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for a full list.

| Problem | Solution |
|---------|---------|
| `VITE_SUPABASE_URL is not defined` | Ensure `.env.local` exists and contains the variable |
| `npm install` fails with ERESOLVE | Try `npm install --legacy-peer-deps` |
| Docker port conflict | Change host port in `docker-compose.yml` |
| Edge function not found | Re-deploy with `supabase functions deploy server` |
