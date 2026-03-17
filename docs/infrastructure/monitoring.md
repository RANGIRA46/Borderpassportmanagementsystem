# Monitoring Guide

This document describes the monitoring strategy for the Border/Passport Management System.

---

## 1. What to Monitor

| Signal | Target | Alert threshold |
|--------|--------|-----------------|
| API error rate | < 1% | > 5% |
| API p95 latency | < 500 ms | > 2 000 ms |
| Frontend JS errors | 0 | > 0 in 5 min |
| Supabase database connections | — | Pool exhausted |
| Edge function cold starts | — | > 5 s |
| Disk usage | — | > 80% |

---

## 2. Built-in Supabase Monitoring

Supabase provides out-of-the-box metrics in the **Dashboard → Reports** section:

- Database query performance
- Auth requests
- Edge function invocations and errors
- Storage usage

No additional setup is required for basic monitoring.

---

## 3. Frontend Error Tracking (Sentry)

Add Sentry to capture uncaught errors and promise rejections in the browser:

```bash
npm install @sentry/react
```

```ts
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  tracesSampleRate: 0.2,
});
```

Set `VITE_SENTRY_DSN` in your environment variables.

---

## 4. Backend Logging

The Edge Function logs all requests via the Hono `logger()` middleware.

View logs:

```bash
# Supabase CLI
supabase functions logs server --project-ref <project-ref> --follow
```

Log format:
```
--> POST /make-server-8ee81f4f/applications/passport
<-- POST /make-server-8ee81f4f/applications/passport 200 45ms
```

---

## 5. Alerting

Configure alerts via:

- **Supabase**: set up email alerts in **Dashboard → Settings → Alerts**.
- **GitHub**: subscribe to Dependabot security alerts.
- **Sentry**: configure alert rules for error spikes.

---

## 6. Performance Baseline

Run load tests to establish baseline metrics before production launch:

```bash
# Install k6
npm install -g k6

# Run the included load test script
k6 run scripts/load-test.js
```

Target baseline:
- 100 concurrent users
- 95th percentile response time < 500 ms
- Error rate < 0.5%
