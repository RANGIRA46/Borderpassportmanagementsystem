# Troubleshooting Guide

Common issues encountered when developing, running, or deploying the Border/Passport Management System (BPMS) and how to resolve them.

---

## Development Issues

### `VITE_SUPABASE_URL is not defined`

**Cause:** The application is reading environment variables that have not been set.

**Solution:**
```bash
cp .env.example .env.local
# Edit .env.local and fill in your Supabase project URL and anon key
```

---

### `npm install` fails with `ERESOLVE`

**Cause:** Peer dependency conflicts between packages.

**Solution:**
```bash
npm install --legacy-peer-deps
```

---

### Vite dev server does not start on port 3000

**Cause:** Port 3000 is already in use.

**Solution:** Kill the process using the port or change the port in `vite.config.ts`:
```ts
server: { port: 3001 }
```

---

### TypeScript errors after pulling latest code

**Cause:** Types from new dependencies not installed.

**Solution:**
```bash
npm install
npx tsc --noEmit
```

---

## Supabase / Backend Issues

### Edge function returns 401 Unauthorized

**Cause:** Missing or expired JWT token.

**Solution:**
- Ensure the frontend is sending `Authorization: Bearer <token>`.
- Verify the token has not expired (default 1-hour lifetime).
- Re-authenticate to obtain a fresh token.

---

### Edge function not found (404)

**Cause:** The function has not been deployed or has a different name.

**Solution:**
```bash
supabase functions deploy server --project-ref <project-ref>
```

---

### `SUPABASE_SERVICE_ROLE_KEY is not defined` in Edge Function

**Cause:** Environment variable not set in the Supabase dashboard.

**Solution:**
1. Open Supabase Dashboard → Edge Functions → `server`.
2. Go to **Settings → Environment variables**.
3. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

---

### Application submission returns 500

**Cause:** KV store error, usually a missing or malformed field in the request body.

**Solution:**
- Check the edge function logs: `supabase functions logs server`.
- Ensure all required fields are present in the request body (see [API docs](./api/endpoints.md)).

---

## Docker Issues

### Docker build fails: `Cannot find module`

**Cause:** `node_modules` not available in the build context.

**Solution:** Ensure `.dockerignore` does NOT exclude `package.json`. Then:
```bash
docker build --no-cache -t bpms-frontend .
```

---

### `docker compose up` fails — port already in use

**Solution:** Stop the conflicting service or change the host port mapping in `docker-compose.yml`.

---

## CI/CD Issues

### GitHub Actions workflow fails on `npm test`

**Cause:** No test framework is currently configured.

**Solution:** This is expected until a test framework is added. The `test.yml` workflow runs `npm run build` as the primary check.

---

### Workflow fails with `Error: Input required and not supplied: token`

**Cause:** A required GitHub Actions secret is not configured.

**Solution:** Go to **Settings → Secrets and variables → Actions** and add the missing secret (see [DEPLOYMENT.md](./DEPLOYMENT.md#41-required-secrets)).

---

## Still Stuck?

1. Search existing [GitHub Issues](https://github.com/RANGIRA46/Borderpassportmanagementsystem/issues).
2. Check the Supabase [documentation](https://supabase.com/docs) and [Discord](https://discord.supabase.com).
3. Open a new issue with:
   - Steps to reproduce
   - Expected vs actual behaviour
   - Error messages and stack traces
   - Environment details (OS, Node version, browser)
