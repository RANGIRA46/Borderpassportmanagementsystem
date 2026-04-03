# Account Registration & Access Control System
## Architecture & Flow Diagrams

---

## 🏗️ SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                            │
│                    (Next.js 14 + React 18)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────┐      ┌──────────────────────────────┐ │
│  │  Authentication     │      │   Admin Management           │ │
│  │  Components         │      │   Components                 │ │
│  ├─────────────────────┤      ├──────────────────────────────┤ │
│  │ • Personnel         │      │ • Permission Preview         │ │
│  │   Onboarding        │      │ • Activity Log               │ │
│  │ • Security          │      │ • User Management           │ │
│  │   Checkpoint (MFA)  │      │ • Role Assignment           │ │
│  │ • Login Form        │      │ • Audit Trail               │ │
│  └──────────┬──────────┘      └──────────────┬───────────────┘ │
│             │                                │                   │
│             └────────────────┬───────────────┘                   │
│                              │                                    │
│                   ┌──────────▼──────────┐                       │
│                   │   RoleProtector     │                       │
│                   │   HOC & Components  │                       │
│                   │                     │                       │
│                   │ • Conditional       │                       │
│                   │   Render            │                       │
│                   │ • Conditional       │                       │
│                   │   Button            │                       │
│                   │ • Permission Check  │                       │
│                   └──────────┬──────────┘                       │
└─────────────────────────────┼──────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Global State     │
                    │  (Zustand Store)  │
                    ├───────────────────┤
                    │ • User Session    │
                    │ • Permissions     │
                    │ • Auth Status     │
                    │ • MFA Required    │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼──────────┐
                    │ Validation Layer   │
                    │ (Zod Schemas)      │
                    ├────────────────────┤
                    │ • Registration     │
                    │ • Login            │
                    │ • MFA Codes        │
                    │ • Email Formats    │
                    └─────────┬──────────┘
                              │
┌─────────────────────────────┼──────────────────────────────────┐
│                              │                                   │
│         API LAYER (HTTP/REST)                                  │
│         ┌────────────────────▼────────────────┐                │
│         │  Authentication Endpoints           │                │
│         ├─────────────────────────────────────┤                │
│         │ POST   /api/auth/register           │                │
│         │ POST   /api/auth/login              │                │
│         │ POST   /api/auth/logout             │                │
│         │ POST   /api/auth/mfa/verify         │                │
│         │ POST   /api/auth/mfa/setup          │                │
│         │ POST   /api/auth/refresh            │                │
│         └────────────────┬─────────────────────┘                │
│                          │                                       │
│         ┌────────────────▼─────────────────┐                   │
│         │  Admin Endpoints                 │                   │
│         ├──────────────────────────────────┤                   │
│         │ GET    /api/admin/users          │                   │
│         │ PUT    /api/admin/users/{id}     │                   │
│         │ PUT    /api/admin/users/{id}/    │                   │
│         │        role                      │                   │
│         │ GET    /api/admin/audit-logs     │                   │
│         │ POST   /api/admin/audit-logs/    │                   │
│         │        export                    │                   │
│         └────────────────┬─────────────────┘                   │
│                          │                                       │
│         JWT Verification & Session Validation                  │
│                          │                                       │
│         Permission Verification (Server-Side)                  │
└──────────────────────────┼───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                          │                                    │
│         DATABASE LAYER                                       │
│                          │                                    │
│    ┌────────────────────▼─────────────────┐                 │
│    │  User Management                     │                 │
│    ├──────────────────────────────────────┤                 │
│    │ • Users Table                        │                 │
│    │ • User Roles                         │                 │
│    │ • User Permissions                   │                 │
│    │ • MFA Secrets                        │                 │
│    │ • Session Tokens                     │                 │
│    └────────────┬───────────────────────┘                   │
│                 │                                            │
│    ┌────────────▼───────────────────────┐                   │
│    │  Audit & Compliance                │                   │
│    ├────────────────────────────────────┤                   │
│    │ • Audit Logs (Immutable)           │                   │
│    │ • Access Requests                  │                   │
│    │ • Approval Workflow                │                   │
│    │ • Change History                   │                   │
│    │ • Compliance Reports               │                   │
│    └────────────────────────────────────┘                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 AUTHENTICATION FLOW

```
┌─────────────────┐
│  User Visits    │
│  Login Page     │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ Enters Credentials   │
│ • Email              │
│ • Password           │
└────────┬─────────────┘
         │
         ▼
    ┌────────────────┐
    │ Validate Input │
    │ (Zod Schema)   │
    └────────┬───────┘
             │ Valid?
         ✓───┴───✗
         │       └─────► [Show Error]
         │               └─► Retry
         ▼
┌──────────────────────┐
│ Check Credentials    │
│ • User exists?       │
│ • Password correct?  │
│ • Account active?    │
└────────┬─────────────┘
         │ Valid?
     ✓───┴───✗
     │       └─────► [Show Error]
     │               └─► Retry
     ▼
┌──────────────────────┐
│ Check MFA Status     │
└────────┬─────────────┘
         │
     MFA Enabled?
     ✓───┬───✗
         │   └─────► Generate JWT
         │           │
         │           ▼
         │       ┌───────────────────┐
         │       │ Set Session       │
         │       │ Cookie (httpOnly) │
         │       └────────┬──────────┘
         │                │
         │                ▼
         │           [Redirect to
         │            Dashboard]
         │
         ▼
┌──────────────────────┐
│ Send MFA Challenge   │
│ • TOTP Code         │
│ • Or Backup Code    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ User Enters Code     │
└────────┬─────────────┘
         │
         ▼
    ┌─────────────────┐
    │ Verify TOTP     │
    │ Against Secret  │
    └────────┬────────┘
             │ Valid?
         ✓───┴───✗
         │       └─────► [Show Error]
         │               └─► Retry
         ▼
┌──────────────────────┐
│ Generate JWT Token   │
│ • MFA Verified Flag  │
│ • User Permissions   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Set Session Cookie   │
│ (httpOnly, Secure)   │
└────────┬─────────────┘
         │
         ▼
    [✓ Login Complete]
         │
         ▼
   [Redirect to
    Dashboard]
```

---

## 📋 REGISTRATION WORKFLOW

```
┌──────────────────────────┐
│ User Requests Access     │
│ Click "Apply for Access" │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ STEP 1: Personal Information │
│ • Full Legal Name            │
└────────┬─────────────────────┘
         │ Valid?
     ✓───┴───✗
         │
         ▼
┌──────────────────────────────┐
│ STEP 2: Government ID        │
│ • Employee ID (Regex)        │
│ • Work Email (Not Gmail)     │
└────────┬─────────────────────┘
         │ Valid?
     ✓───┴───✗
         │
         ▼
┌──────────────────────────────┐
│ STEP 3: Agency & Rank        │
│ • Select Agency              │
│ • Select Rank/Level          │
│ • Department Description     │
└────────┬─────────────────────┘
         │ Valid?
     ✓───┴───✗
         │
         ▼
┌──────────────────────────────┐
│ STEP 4: Supervisor Info      │
│ • Supervisor Email           │
└────────┬─────────────────────┘
         │ Valid?
     ✓───┴───✗
         │
         ▼
┌──────────────────────────────┐
│ STEP 5: Review & Confirm     │
│ • Show All Information       │
│ • Request Confirmation       │
└────────┬─────────────────────┘
         │ Confirm?
     ✓───┴───✗
         │       └─► [Edit]
         │           │
         │           ▼
         │       [Back to Review]
         ▼
┌──────────────────────────────┐
│ Create Access Request        │
│ • Store in DB               │
│ • Generate Request ID       │
│ • Set Status: PENDING       │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Send Supervisor Email        │
│ • Request Details           │
│ • Verification Link         │
│ • Approval Form             │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Show Confirmation Message    │
│ • Request ID                │
│ • Pending Status            │
│ • What Happens Next         │
└──────────────────────────────┘

Supervisor Flow:
┌──────────────────────────┐
│ Supervisor Receives      │
│ Verification Email       │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Supervisor Clicks Link   │
│ Reviews Application      │
└────────┬─────────────────┘
         │
      Approve? Reject?
      │         │
      ▼         ▼
    [YES]     [NO]
      │         │
      │         ▼
      │     Update Status:
      │     REJECTED
      │
      ▼
Update Status: APPROVED
      │
      ▼
Notify Admin
to Assign Role
      │
      ▼
User Gets Access!
```

---

## 🔐 ROLE-BASED ACCESS CONTROL

```
┌─────────────────────────────┐
│  Zustand Auth Store         │
│                             │
│  User Session:              │
│  ├─ id                      │
│  ├─ email                   │
│  ├─ role: Role              │
│  └─ permissions: Permission[]
│                             │
│  Methods:                   │
│  ├─ hasPermission()         │
│  ├─ hasRole()               │
│  └─ updateUserRole()        │
└────────────┬────────────────┘
             │
        ┌────┴────┐
        │          │
        ▼          ▼
┌────────────────┐ ┌──────────────────────┐
│ Permission     │ │ RoleProtector        │
│ Check          │ │ HOC                  │
│                │ │                      │
│ hasPermission? │ │ - Checks permissions │
│ (synchronous)  │ │ - Renders/Hides UI   │
│                │ │ - Shows fallback     │
└────────────────┘ │ - Tooltip for locked │
                   └──────────────────────┘

Usage Pattern:
              ┌────────────────────┐
              │ Try to Render View │
              └────────┬───────────┘
                       │
              ┌────────▼──────────┐
              │ RoleProtector     │
              │ checks user perms │
              └────────┬──────────┘
                       │
                   Allowed?
                   ✓───┬───✗
                       │   │
                       ▼   ▼
                   [Render] [Fallback]
```

---

## 📊 PERMISSION HIERARCHY

```
System Architect (Level 4)
│
├── System Configuration
│   ├── manage:api_keys
│   ├── system:configuration
│   └── manage:users
│
├── User Management
│   ├── assign:roles
│   ├── manage:users
│   └── view:audit_logs
│
├── Data Management
│   ├── export:data
│   └── view:analytics
│
└── All Level 1, 2, 3 permissions


Security Admin (Level 3)
│
├── Security Operations
│   ├── security:red_flag
│   ├── security:unlock_flagged
│   └── security:override
│
├── Traveler Management
│   ├── write:traveler_data
│   ├── view:internal_flags
│   └── create:flags
│
├── Data Access
│   ├── view:audit_logs
│   ├── view:analytics
│   └── export:data
│
└── All Level 1, 2 permissions


Visa Analyst (Level 2)
│
├── Visa Processing
│   ├── process:applications
│   ├── approve:visa
│   ├── deny:visa
│   └── edit:applications
│
├── Document Access
│   └── view:sensitive_docs
│
└── All Level 1 permissions


Field Officer (Level 1)
│
├── Border Operations
│   ├── scan:passports
│   ├── create:entry_log
│   └── create:exit_log
│
└── Basic Access
    ├── read:traveler_data
    └── view:logs
```

---

## 🔍 AUDIT LOG FLOW

```
User Action
    │
    ▼
┌──────────────────────┐
│ Action Triggered     │
│ (e.g., Approve Visa) │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────┐
│ Check Permissions        │
│ (Server-Side)            │
└────────┬─────────────────┘
         │
    Allowed?
    ✓───┬───✗
        │   └─► [Log Failure]
        │       └─► Return 403
        ▼
┌──────────────────────────┐
│ Execute Action           │
│ • Update Database        │
│ • Return Success         │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Create Audit Log Entry   │
│                          │
│ • timestamp: NOW()       │
│ • userId: user.id        │
│ • userName: user.name    │
│ • action: VISA_APPROVED  │
│ • resourceId: visa_123   │
│ • changes: { before,     │
│             after }      │
│ • status: success        │
│ • ipAddress: req.ip      │
│ • userAgent: req.ua      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Store in Audit DB       │
│ (Immutable, Append-Only)│
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Available for:           │
│ • Compliance Reviews     │
│ • Forensic Analysis      │
│ • Admin Audit Dashboard  │
│ • Regulatory Reports     │
└──────────────────────────┘
```

---

## 🛡️ SECURITY LAYERS

```
┌──────────────────────────────────────────────────────┐
│            FRONT-END SECURITY                        │
├──────────────────────────────────────────────────────┤
│ ✓ RoleProtector prevents rendering                   │
│ ✓ ConditionalButton disables unauthorized actions    │
│ ✓ Input validation with Zod                          │
│ ✓ Token stored in httpOnly cookie                    │
│ ✓ XSS prevention (React escapes)                     │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼ (HTTPS)
┌──────────────────────────────────────────────────────┐
│            MIDDLEWARE SECURITY                       │
├──────────────────────────────────────────────────────┤
│ ✓ JWT verification                                   │
│ ✓ CSRF token validation                              │
│ ✓ Rate limiting                                      │
│ ✓ Request logging                                    │
│ ✓ Security headers (CSP, etc.)                       │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│            API SECURITY                              │
├──────────────────────────────────────────────────────┤
│ ✓ Server-side permission check                       │
│ ✓ Validation of all inputs                           │
│ ✓ Audit log creation                                 │
│ ✓ Error handling (no info leaks)                     │
│ ✓ Parameter tampering detection                      │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│            DATABASE SECURITY                         │
├──────────────────────────────────────────────────────┤
│ ✓ Parameterized queries (no SQL injection)           │
│ ✓ Password hashing (bcrypt/Argon2)                   │
│ ✓ Encrypted sensitive fields                         │
│ ✓ Row-Level Security (RLS) policies                  │
│ ✓ Immutable audit logs                               │
│ ✓ Regular backups                                    │
└──────────────────────────────────────────────────────┘
```

---

**Diagrams Created**: April 3, 2026
**Version**: 1.0.0
**Status**: ✅ **Complete**

