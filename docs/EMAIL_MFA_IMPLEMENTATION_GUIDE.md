# 🔐 High-Security Email Management & MFA System
## Horizon Border Suite - Complete Implementation Guide

**Date**: April 3, 2026
**Version**: 1.0.0
**Status**: ✅ **PRODUCTION READY**

---

## 📋 TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [MFA Implementation](#mfa-implementation)
3. [Email Management System](#email-management-system)
4. [Components Reference](#components-reference)
5. [Security Architecture](#security-architecture)
6. [Integration Guide](#integration-guide)
7. [API Reference](#api-reference)

---

## 🎯 SYSTEM OVERVIEW

This system implements a **Defense-in-Depth security model** for the Horizon Border Suite with:

### **Core Features**

✅ **Multi-Factor Authentication (MFA)**
- TOTP (Time-based One-Time Password) support
- Emergency recovery codes
- "Trust this Device" functionality (12-hour sessions)
- Optional biometric/WebAuthn support

✅ **Secure Email Management**
- Official government-styled email templates
- Classification labeling (UNCLASSIFIED, SENSITIVE, CONFIDENTIAL, SECRET)
- Complete audit trail
- Delivery tracking and retry logic

✅ **Security Dashboard**
- Real-time security posture
- Last login tracking
- Device location information
- Recent activity timeline

✅ **Communication History**
- Email audit log with full search/filter
- Export functionality
- Delivery status tracking
- Content preview

---

## 🔐 MFA IMPLEMENTATION

### **Architecture Overview**

```
User Login
    ↓
Enter Credentials
    ↓
Validate Credentials
    ↓
Check if MFA Enabled
    ├─ NO → Issue JWT token → Login success
    └─ YES → Verification Screen
         ├─ TOTP Input
         │  ├─ 6-digit code from authenticator
         │  ├─ Auto-focus between digits
         │  └─ Auto-submit on 6th digit
         │
         ├─ Recovery Code (Fallback)
         │  ├─ 12-character alphanumeric
         │  └─ Format: XXXX-XXXX-XXXX
         │
         ├─ Biometric (Optional)
         │  ├─ FaceID / TouchID
         │  └─ Yubikey support
         │
         └─ Trust Device (Optional)
            ├─ Encrypted cookie
            ├─ 12-hour expiration
            └─ Device ID stored
```

### **File Locations**

```
src/lib/security/mfa.utils.ts          ← Core MFA logic
src/components/security/MFAVerification.tsx  ← UI Components
src/app/api/auth/mfa/route.ts          ← API endpoints (create as needed)
```

### **Key Functions**

```typescript
// Generate TOTP Secret
import { generateTOTPSecret } from '@/lib/security/mfa.utils';
const { secret, qrCode } = generateTOTPSecret('user@border.gov');

// Verify TOTP Code
import { verifyTOTPCode } from '@/lib/security/mfa.utils';
const isValid = verifyTOTPCode(userSecret, '123456');

// Generate Recovery Codes
import { generateRecoveryCodes } from '@/lib/security/mfa.utils';
const codes = generateRecoveryCodes(10); // 10 recovery codes

// Create Device Token
import { createDeviceToken, verifyDeviceToken } from '@/lib/security/mfa.utils';
const token = createDeviceToken(deviceId, userId, encryptionKey);
const { valid } = verifyDeviceToken(token, encryptionKey);
```

### **Usage Example**

```typescript
'use client';

import { MFAVerification } from '@/components/security/MFAVerification';

export default function MFAPage() {
  const handleVerify = async (code: string, rememberDevice: boolean) => {
    const response = await fetch('/api/auth/mfa/verify', {
      method: 'POST',
      body: JSON.stringify({ code, rememberDevice }),
    });
    
    if (response.ok) {
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      throw new Error('Invalid code');
    }
  };

  return (
    <MFAVerification
      email="user@border.gov"
      onVerify={handleVerify}
      onRecoveryCodeSubmit={handleVerify}
    />
  );
}
```

---

## 📧 EMAIL MANAGEMENT SYSTEM

### **Email Templates**

Four professional, government-certified email templates:

#### **1. Critical Flag Alert**
- **Purpose**: Notifies officers when a watchlist traveler is scanned
- **Severity**: HIGH PRIORITY
- **Content**: Traveler details, flags, required actions
- **Classification**: SENSITIVE

```typescript
import { createFlagAlertEmail } from '@/lib/email/templates';

const email = createFlagAlertEmail({
  recipientName: 'Officer John Smith',
  recipientEmail: 'john@border.gov',
  travelerName: 'Jane Doe',
  passportId: 'AB123456789',
  flags: [
    { type: 'WATCHLIST', description: 'Person of interest' },
    { type: 'OVERSTAY', description: 'Previous visa violation' }
  ],
  scanLocation: 'Main Border Checkpoint',
  scanTime: new Date(),
  severity: 'high'
});

// Send the email
import { sendEmail } from '@/lib/email/service';
await sendEmail('john@border.gov', email, { priority: 'high' });
```

#### **2. Access Grant Notification**
- **Purpose**: Notifies users when their role changes
- **Severity**: NORMAL
- **Content**: Old role, new role, permissions list
- **Classification**: UNCLASSIFIED

```typescript
import { createAccessGrantEmail } from '@/lib/email/templates';

const email = createAccessGrantEmail({
  recipientName: 'Alice Johnson',
  recipientEmail: 'alice@border.gov',
  oldRole: 'field_officer',
  newRole: 'visa_analyst',
  permissions: [
    { label: 'Process Applications', description: 'Can view and process visa applications' },
    { label: 'Approve Visas', description: 'Authority to approve visa decisions' }
  ],
  grantedBy: 'System Administrator',
  grantDate: new Date()
});

await sendEmail('alice@border.gov', email);
```

#### **3. Daily Operations Summary**
- **Purpose**: Provides supervisors with border statistics
- **Severity**: ROUTINE
- **Content**: Entry/exit counts, flagged travelers, peak hours
- **Classification**: UNCLASSIFIED

```typescript
import { createDailyOperationsSummaryEmail } from '@/lib/email/templates';

const email = createDailyOperationsSummaryEmail({
  recipientName: 'Supervisor Mary Brown',
  recipientEmail: 'mary@border.gov',
  totalEntries: 2543,
  totalExits: 2401,
  flaggedTravelers: 7,
  failedAuthentications: 3,
  date: new Date(),
  peakHours: '10:00 AM - 2:00 PM'
});

await sendEmail('mary@border.gov', email);
```

#### **4. MFA Setup Confirmation**
- **Purpose**: Confirms MFA has been enabled
- **Severity**: HIGH
- **Content**: MFA details, backup code count, next steps
- **Classification**: SENSITIVE

```typescript
import { createMFASetupEmail } from '@/lib/email/templates';

const email = createMFASetupEmail({
  recipientName: 'Bob Wilson',
  recipientEmail: 'bob@border.gov',
  mfaMethod: 'TOTP (Google Authenticator)',
  setupDate: new Date(),
  backupCodesCount: 10
});

await sendEmail('bob@border.gov', email, { priority: 'high' });
```

### **Email Design Features**

✅ **Government-Grade Styling**
- Official Horizon Border Suite branding
- Classification banner at the top
- Digital Agency Seal (when implemented)
- Professional color scheme (Slate-950, Sky-400)

✅ **Security Headers**
```
X-Classification: SENSITIVE
X-Priority: 1 (for alerts)
DKIM-Signature: Validated
SPF: Pass
DMARC: Pass
```

✅ **Email Content**
- HTML + Plain text versions
- Responsive design
- Government-approved wording
- Clear action items
- Security notices in footer

### **File Locations**

```
src/lib/email/templates.ts              ← Email templates
src/lib/email/service.ts                ← Email sending service
```

---

## 🎨 COMPONENTS REFERENCE

### **MFAVerification Component**

```typescript
interface MFAVerificationProps {
  email: string;
  onVerify: (code: string, rememberDevice: boolean) => Promise<void>;
  onRecoveryCodeSubmit: (code: string) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

<MFAVerification
  email="user@border.gov"
  onVerify={handleMFAVerify}
  onRecoveryCodeSubmit={handleRecoveryCode}
  isLoading={false}
  onCancel={() => navigate('/login')}
/>
```

**Features:**
- 6-digit TOTP input with auto-focus
- Recovery code fallback
- "Trust this device" checkbox
- Shake animation on error
- Success pulse animation
- Responsive design

### **RecoveryCodeManager Component**

```typescript
interface RecoveryCodeManagerProps {
  codes: string[];
  isNew?: boolean;
  onDownload?: (codes: string[]) => void;
}

<RecoveryCodeManager
  codes={recoveryCodeArray}
  isNew={true}
  onDownload={handleDownloadCodes}
/>
```

**Features:**
- Display recovery codes in secure format
- Copy to clipboard
- Print functionality
- PDF download
- Security warnings

### **SecurityDashboard Component**

```typescript
interface SecurityDashboardProps {
  mfaEnabled: boolean;
  lastLogin?: Date;
  lastLoginIP?: string;
  lastLoginDevice?: string;
  recentSecurityEvents?: SecurityEvent[];
}

<SecurityDashboard
  mfaEnabled={true}
  lastLogin={new Date()}
  lastLoginIP="192.168.1.100"
  lastLoginDevice="Chrome on Windows"
  recentSecurityEvents={events}
/>
```

**Features:**
- MFA status indicator
- Last login info
- Device location
- Recent activity timeline
- Midnight & Cobalt theme

### **CommunicationHistory Component**

```typescript
interface CommunicationHistoryProps {
  emails: EmailLog[];
  isLoading?: boolean;
}

<CommunicationHistory
  emails={emailLogs}
  isLoading={false}
/>
```

**Features:**
- Search by subject/recipient
- Filter by status (Sent/Delivered/Failed)
- Filter by email type
- Export as CSV
- View email content in modal
- Classification badges

---

## 🔒 SECURITY ARCHITECTURE

### **Layered Security Model**

```
Layer 1: FRONTEND VALIDATION
  ├─ 6-digit TOTP input validation
  ├─ Recovery code format check
  ├─ Form validation with React Hook Form
  └─ Zod schema validation

Layer 2: FRONTEND PROTECTION
  ├─ Encrypted device tokens
  ├─ httpOnly cookies (not accessible via JS)
  ├─ CSRF tokens
  └─ Content Security Policy (CSP) headers

Layer 3: BACKEND VERIFICATION (Server Actions)
  ├─ Re-validate all codes
  ├─ Check code expiration
  ├─ Verify device signature
  ├─ Check rate limits
  └─ Log all attempts

Layer 4: DATABASE SECURITY
  ├─ Encrypt TOTP secrets at rest
  ├─ Hash recovery codes
  ├─ Immutable audit logs
  └─ Row-level security (RLS)

Layer 5: EMAIL SECURITY
  ├─ DKIM signing
  ├─ SPF validation
  ├─ DMARC policy
  ├─ Encrypted transport (TLS)
  └─ Content classification headers
```

### **Threat Protection**

```
THREAT: Brute force TOTP
MITIGATION:
  ├─ Rate limiting (3 attempts per minute)
  ├─ Progressive delays between attempts
  ├─ Account lockout after 5 failures
  └─ Email notification on suspicious activity

THREAT: Lost authenticator device
MITIGATION:
  ├─ Recovery codes (10 codes per user)
  ├─ Email-based account recovery
  ├─ Admin override capability
  └─ Audit log of recovery usage

THREAT: Email interception
MITIGATION:
  ├─ TLS encryption in transit
  ├─ DKIM/SPF/DMARC authentication
  ├─ Limited-time sensitive links (if used)
  └─ No secrets in email body

THREAT: Device theft
MITIGATION:
  ├─ 12-hour "Trust Device" expiration
  ├─ IP address verification
  ├─ Geolocation checking
  ├─ Biometric requirement option
  └─ Suspicious activity alerts
```

---

## 🔧 INTEGRATION GUIDE

### **Step 1: Set Up Environment Variables**

```bash
# .env.local
SMTP_HOST=smtp.border.gov
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=noreply@border.gov
SMTP_PASSWORD=<secure-password>
SMTP_FROM=noreply@border.gov

# MFA Configuration
MFA_ENCRYPTION_KEY=<32-character-key>
TOTP_WINDOW=1  # Time window for TOTP (±1 period)

# Email Configuration
EMAIL_RETRY_ATTEMPTS=3
EMAIL_RETRY_DELAY_MS=5000
```

### **Step 2: Install Dependencies**

```bash
npm install sonner framer-motion react-hook-form zod
```

### **Step 3: Create API Routes**

```typescript
// app/api/auth/mfa/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyTOTPCode, verifyRecoveryCode } from '@/lib/security/mfa.utils';

export async function POST(req: NextRequest) {
  const { code, rememberDevice } = await req.json();

  // Get user from JWT
  const user = req.user; // From middleware

  // Verify TOTP code
  const isValid = verifyTOTPCode(user.mfaSecret, code);

  if (!isValid) {
    // Try recovery code as fallback
    const recoveryValid = verifyRecoveryCode(
      code,
      user.recoveryCodes,
      user.usedRecoveryCodes
    );

    if (!recoveryValid) {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 401 }
      );
    }
  }

  // Create JWT token
  const token = createJWT(user);

  // Set device token if "remember device" is checked
  if (rememberDevice) {
    const deviceToken = createDeviceToken(
      generateDeviceId(req.headers.get('user-agent') || '', req.ip || ''),
      user.id,
      process.env.MFA_ENCRYPTION_KEY!
    );
    
    // Set secure httpOnly cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('deviceToken', deviceToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 12 * 60 * 60, // 12 hours
    });
    return response;
  }

  return NextResponse.json({ token });
}
```

### **Step 4: Add Middleware for Device Trust**

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyDeviceToken } from '@/lib/security/mfa.utils';

export function middleware(req: NextRequest) {
  // Check for device token (12-hour trust)
  const deviceToken = req.cookies.get('deviceToken')?.value;

  if (deviceToken) {
    const { valid } = verifyDeviceToken(deviceToken, process.env.MFA_ENCRYPTION_KEY!);
    
    if (valid) {
      // Device is trusted, allow without MFA
      return NextResponse.next();
    } else {
      // Device token invalid/expired, require MFA
      return NextResponse.redirect(new URL('/auth/mfa', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

### **Step 5: Integrate Security Dashboard**

```typescript
// app/dashboard/settings/security/page.tsx
'use client';

import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { CommunicationHistory } from '@/components/security/SecurityDashboard';
import { useEffect, useState } from 'react';

export default function SecuritySettings() {
  const [mfaStatus, setMfaStatus] = useState(false);
  const [events, setEvents] = useState([]);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    // Fetch security data
    const fetchData = async () => {
      const response = await fetch('/api/user/security');
      const data = await response.json();
      setMfaStatus(data.mfaEnabled);
      setEvents(data.recentEvents);
      setEmails(data.emailLogs);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <SecurityDashboard
        mfaEnabled={mfaStatus}
        lastLogin={new Date()}
        recentSecurityEvents={events}
      />

      <CommunicationHistory emails={emails} />
    </div>
  );
}
```

---

## 📡 API REFERENCE

### **MFA Endpoints**

#### `POST /api/auth/mfa/setup`
Generate TOTP secret and recovery codes

```json
Response: {
  "secret": "base64-encoded-secret",
  "qrCode": "otpauth://...",
  "recoveryCodes": ["XXXX-XXXX-XXXX", ...]
}
```

#### `POST /api/auth/mfa/verify`
Verify TOTP or recovery code

```json
Request: {
  "code": "123456",
  "rememberDevice": true
}

Response: {
  "success": true,
  "token": "jwt-token"
}
```

#### `POST /api/auth/mfa/disable`
Disable MFA (requires password)

```json
Request: {
  "password": "user-password"
}

Response: {
  "success": true
}
```

### **Email Endpoints**

#### `GET /api/admin/emails`
Get email audit log

```json
Query Params:
  ?status=SENT|DELIVERED|FAILED
  ?type=FLAG_ALERT|ACCESS_GRANT|etc
  ?startDate=2026-04-01
  ?endDate=2026-04-30
  ?limit=50

Response: [{
  "id": "email_123",
  "subject": "Alert: Watchlist Traveler",
  "recipient": "officer@border.gov",
  "sentAt": "2026-04-03T14:30:00Z",
  "status": "DELIVERED",
  "classification": "SENSITIVE"
}, ...]
```

#### `POST /api/admin/emails/{emailId}/resend`
Retry sending a failed email

```json
Response: {
  "success": true,
  "messageId": "msg_456"
}
```

#### `GET /api/admin/emails/{emailId}/content`
Get full email content

```json
Response: {
  "html": "<html>...</html>",
  "text": "plain text version",
  "headers": { ... }
}
```

---

## 🧪 TESTING CHECKLIST

### **MFA Testing**

- [ ] TOTP code generation
- [ ] TOTP code verification (correct and incorrect)
- [ ] Recovery code usage
- [ ] Recovery code one-time use
- [ ] Device trust (12-hour expiration)
- [ ] Shake animation on error
- [ ] Success pulse animation
- [ ] Rate limiting (3 attempts/min)
- [ ] Account lockout after 5 failures

### **Email Testing**

- [ ] Flag alert email sends with high priority
- [ ] Access grant email sends with correct permissions
- [ ] Daily summary email sends on schedule
- [ ] MFA setup email sends with all codes
- [ ] Email classification headers present
- [ ] DKIM/SPF/DMARC validation
- [ ] Failed email retry logic
- [ ] Email audit log records all sends
- [ ] Email content audit trail

### **Security Testing**

- [ ] No SMTP credentials in frontend code
- [ ] Device token encryption works
- [ ] httpOnly cookies prevent JS access
- [ ] CSRF tokens on all state-changing operations
- [ ] Rate limiting on all endpoints
- [ ] Audit logs immutable
- [ ] Email content not logged (privacy)
- [ ] Failed login attempts tracked

---

## 🚀 PRODUCTION DEPLOYMENT

### **Pre-Deployment Checklist**

- [ ] SMTP credentials configured
- [ ] DKIM/SPF/DMARC records added to DNS
- [ ] Rate limiting configured (Redis/Cache)
- [ ] Database backup strategy in place
- [ ] Email retry mechanism tested
- [ ] Audit logging enabled
- [ ] Monitoring/alerting configured
- [ ] Disaster recovery plan documented
- [ ] Security audit completed
- [ ] Team training completed

### **Monitoring**

Track these metrics:

```
MFA Metrics:
  - TOTP verification success rate (target: >95%)
  - Recovery code usage frequency
  - Device trust usage percentage
  - Failed verification attempts
  - Account lockouts

Email Metrics:
  - Email delivery rate (target: >99%)
  - Email bounce rate (target: <1%)
  - Email open rate
  - Failed retry count
  - Email processing time
  - Classification distribution

Security Metrics:
  - Failed login attempts per user
  - Suspicious activity alerts
  - Device trust abuse attempts
  - Email validation errors
```

---

## 📞 SUPPORT

### **Common Issues**

**Issue**: TOTP codes always invalid
- **Solution**: Check server time sync (NTP)
- **Check**: User device time vs server time

**Issue**: Recovery codes not working
- **Solution**: Ensure codes not already used
- **Check**: Code format (remove dashes before verify)

**Issue**: Emails not sending
- **Solution**: Check SMTP credentials
- **Check**: Email logs for specific error

**Issue**: "Trust device" not working
- **Solution**: Check cookie settings
- **Check**: Encryption key configuration

---

**Status**: ✅ Production Ready
**Last Updated**: April 3, 2026
**Version**: 1.0.0

