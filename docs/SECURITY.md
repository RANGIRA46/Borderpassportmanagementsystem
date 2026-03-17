# Security Practices

This document describes the security measures implemented in the Border/Passport Management System (BPMS) and the compliance requirements the system must meet.

---

## 1. Security Checklist

| Control | Status | Notes |
|---------|--------|-------|
| HTTPS/TLS everywhere | ✅ | Enforced by Supabase and CDN |
| Secrets in environment variables | ✅ | No hardcoded secrets; `.env.example` provided |
| Database encryption at rest | ✅ | Supabase encrypts storage by default |
| Database encryption in transit | ✅ | TLS enforced by Supabase |
| Regular automated backups | ✅ | Daily automated, weekly full, monthly archive |
| CORS properly configured | ✅ | Allow-list approach in `cors()` middleware |
| Rate limiting | ✅ | Configured per IP in Edge Function |
| Input validation / sanitisation | ✅ | Zod schemas on all POST bodies |
| Audit logging | ✅ | Every state change recorded with actor and timestamp |
| JWT expiry | ✅ | Short-lived access tokens (1 hour), refresh tokens rotated |
| Row-level security (RLS) | ✅ | Supabase RLS policies enforce data isolation |
| Security headers | ✅ | X-Content-Type-Options, X-Frame-Options, HSTS |
| DDoS protection | ✅ | Supabase edge infrastructure |
| Dependency vulnerability scanning | ✅ | GitHub Dependabot + `security.yml` workflow |
| Secret detection in CI | ✅ | `security.yml` workflow |

---

## 2. Authentication & Authorisation

- Authentication is handled by **Supabase Auth** (JWT-based).
- JWTs are verified server-side on every protected request.
- Three user roles: **citizen**, **official**, **admin**.
- Role-based access is enforced both via API middleware and Supabase RLS.

### Password Policy

- Minimum 8 characters.
- Must contain at least one uppercase letter, one digit, and one special character.
- Passwords are hashed using bcrypt (handled by Supabase Auth).

---

## 3. Data Privacy & GDPR Compliance

- **Data minimisation:** only necessary personal data is collected.
- **Right to access:** citizens can export their data via account settings.
- **Right to erasure:** account deletion removes all personal data within 30 days.
- **Consent:** explicit consent collected at registration.
- **Data retention:** applications are retained for the legally required period, then deleted.
- **Breach notification:** incidents reported to affected users within 72 hours as required.

---

## 4. Input Validation & Sanitisation

- All API request bodies are validated using Zod schemas before processing.
- String inputs are trimmed and length-limited.
- File uploads are validated for MIME type and maximum size (5 MB).
- SQL injection is prevented by Supabase's parameterised queries.
- XSS is mitigated by React's default HTML escaping and `DOMPurify` where raw HTML is needed.

---

## 5. Sensitive Data Handling

- Passport numbers, national ID numbers, and dates of birth are treated as PII.
- PII is never logged in plaintext.
- PII is masked in error messages returned to the client.
- Document files are stored in a private Supabase Storage bucket, accessible only via signed URLs.

---

## 6. Dependency Management

- Dependencies are kept up to date via GitHub Dependabot.
- The `security.yml` CI workflow runs `npm audit` on every push.
- Critical vulnerabilities must be patched within 48 hours; high within 1 week.

---

## 7. Incident Response

1. **Detect** — monitoring alerts or user report.
2. **Contain** — disable affected feature or user account if needed.
3. **Assess** — determine scope and impacted users.
4. **Notify** — inform affected users and relevant authorities as required.
5. **Remediate** — deploy fix and verify resolution.
6. **Review** — post-incident review within 5 business days.

---

## 8. Security Contact

Report security vulnerabilities privately via the repository's **Security** tab (GitHub private vulnerability reporting).  
Do not open public issues for security vulnerabilities.
