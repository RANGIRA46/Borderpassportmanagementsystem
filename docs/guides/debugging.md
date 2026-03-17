# Debugging Guide

Tips and tools for debugging the Border/Passport Management System.

---

## 1. Frontend Debugging

### Browser DevTools

- **Console:** `console.log`, `console.error`, `console.table` for data inspection.
- **Network tab:** inspect API requests and responses — check status codes, headers, and payloads.
- **React DevTools extension:** inspect component tree, props, and state.

### Vite Source Maps

Source maps are enabled in development (`npm run dev`) by default.  
Set breakpoints directly in TypeScript source files in the browser's Sources panel.

### Common Frontend Debug Patterns

```ts
// Inspect Supabase auth state
import { supabase } from '@/utils/supabase/info';
const { data } = await supabase.auth.getSession();
console.log('Session:', data.session);

// Inspect API response
const res = await fetch('/api/applications/status/PASS-xxx');
const json = await res.json();
console.table(json);
```

---

## 2. Backend (Edge Function) Debugging

### View Live Logs

```bash
# Stream logs from deployed function
supabase functions logs server --project-ref <project-ref> --follow

# Local development logs appear in the terminal where you ran:
supabase functions serve server
```

### Add Temporary Debug Logging

The backend uses `console.log` which appears in edge function logs:

```ts
console.log('Received payload:', JSON.stringify(formData));
```

### Test Endpoints with curl

```bash
# Health check
curl http://localhost:54321/functions/v1/server/make-server-8ee81f4f/health

# Submit test application
curl -X POST http://localhost:54321/functions/v1/server/make-server-8ee81f4f/applications/passport \
  -H "Content-Type: application/json" \
  -d '{"email":"debug@example.com","firstName":"Test","lastName":"User","dateOfBirth":"1990-01-01","nationality":"Rwandan"}'
```

---

## 3. Database Debugging

### Open Supabase Studio

Go to your project in [supabase.com](https://supabase.com) → **Table Editor** to browse rows directly.

### Query the Database

```bash
# Open psql via Supabase CLI
supabase db connect --project-ref <project-ref>

# Or use the SQL Editor in Supabase Studio
```

---

## 4. Environment Variable Issues

```bash
# Print all Vite-exposed env vars at runtime
console.log(import.meta.env);
```

If a variable is `undefined`, ensure:
1. The variable is defined in `.env.local`.
2. The variable name starts with `VITE_` for frontend access.
3. You restarted the Vite dev server after editing `.env.local`.

---

## 5. TypeScript Errors

```bash
# Type-check without building
npx tsc --noEmit

# Show detailed error output
npx tsc --noEmit --pretty
```

---

## 6. Useful VS Code Extensions

| Extension | Purpose |
|-----------|---------|
| ESLint | Inline lint feedback |
| Prettier | Auto-format on save |
| TypeScript Hero | Import management |
| React Developer Tools | Component inspection |
| REST Client | Send HTTP requests from `.http` files |
| GitLens | Rich git history and blame |
