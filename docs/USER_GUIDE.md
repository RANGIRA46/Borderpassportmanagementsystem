# User Guide

This guide explains how to use the Border/Passport Management System (BPMS) for each user role.

---

## Table of Contents

1. [For Citizens](#1-for-citizens)
2. [For Immigration Officials](#2-for-immigration-officials)
3. [For Administrators](#3-for-administrators)

---

## 1. For Citizens

### 1.1 Creating an Account

1. Navigate to the application home page.
2. Click **Register / Create Account**.
3. Enter your email address and create a strong password.
4. Check your email for a confirmation link and click it.
5. Log in with your credentials.

### 1.2 Applying for a Passport

1. After logging in, click **Apply for Passport** from the home page.
2. Complete all required fields:
   - Personal information (full name, date of birth, place of birth)
   - Contact details
   - Emergency contact
   - Passport type (ordinary, official, diplomatic, emergency)
3. Upload supporting documents (national ID, birth certificate, photos).
4. Review your application and click **Submit**.
5. Note your **reference number** — you will need it to track your application.

### 1.3 Uploading Documents

1. Open your application using the reference number.
2. Click **Upload Documents**.
3. Drag and drop files or click to browse.
4. Accepted formats: PDF, JPEG, PNG (max 5 MB per file).
5. Click **Upload** and wait for confirmation.

### 1.4 Scheduling an Appointment

1. From the home page, click **Book Appointment**.
2. Select the **service type** (e.g., biometric enrolment, passport collection).
3. Choose a **location**, **date**, and **time slot**.
4. Enter your email and confirm.
5. You will receive a confirmation email with appointment details.

### 1.5 Tracking Application Status

1. Click **Check Status** on the home page.
2. Enter your **reference number** (e.g., `PASS-1700000000000-123`).
3. View the full status history timeline.

### 1.6 Renewing a Passport

1. Log in and go to **My Applications**.
2. Click **Renew Passport** next to an eligible passport.
3. Confirm pre-filled personal details and update if needed.
4. Upload required renewal documents.
5. Pay the renewal fee (if applicable).
6. Submit and note the new reference number.

---

## 2. For Immigration Officials

### 2.1 Dashboard Overview

After logging in as an official, you are taken to the **Officer Dashboard**, which shows:

- **Pending applications** requiring review
- **Today's appointments** at your assigned office
- **Recent border crossings** recorded at your post
- **Application statistics** for the current period

### 2.2 Reviewing Applications

1. From the dashboard, open **Application Queue**.
2. Click an application to view full details, uploaded documents, and status history.
3. Choose an action:
   - **Approve** — moves status to `approved`
   - **Request documents** — moves status to `awaiting_documents` with a note
   - **Reject** — moves status to `rejected` with a mandatory reason
4. Click **Submit decision**.

### 2.3 Managing Appointments

1. Navigate to **Appointments** in the sidebar.
2. View the daily/weekly calendar of booked appointments.
3. Mark appointments as **Completed** or **No Show**.
4. Reschedule or cancel appointments if necessary.

### 2.4 Recording Border Crossings

1. Go to **Border Crossings → Record Entry/Exit**.
2. Scan or enter the traveller's document number.
3. Select crossing type (**Entry** or **Exit**) and border post.
4. Confirm and submit.

### 2.5 Generating Reports

1. Open **Reports** in the sidebar.
2. Select a report type:
   - Application volume by type and period
   - Processing time averages
   - Border crossing traffic
3. Set date range and click **Generate**.
4. Export as CSV or PDF.

---

## 3. For Administrators

### 3.1 System Management

Access **Admin Panel → System Settings** to configure:

- Office locations and available appointment slots
- Application types visible to citizens
- Email/SMS notification templates
- Maintenance mode

### 3.2 User Management

1. Navigate to **Admin Panel → Users**.
2. Search for a user by email or name.
3. View their role, status, and activity log.
4. Actions available:
   - **Change role** (citizen / official / admin)
   - **Suspend account**
   - **Reset password**
   - **Delete account** (with GDPR data erasure)

### 3.3 Monitoring & Logs

1. Open **Admin Panel → Audit Log** to see every state-changing action with timestamp and actor.
2. Open **Admin Panel → System Health** to view:
   - API response times
   - Error rates
   - Database connection status

### 3.4 Analytics & Reporting

Navigate to **Admin Panel → Analytics** for:

- Overall application statistics (total, by type, by status)
- Processing time trends
- Appointment utilisation rates
- Border crossing volumes
- Export all data as CSV

### 3.5 Configuration

| Setting | Location | Description |
|---------|---------|-------------|
| Email templates | Settings → Notifications | Customise automated emails |
| Office hours | Settings → Offices | Set appointment availability |
| Rate limits | Settings → Security | Adjust API rate limits |
| Feature flags | Settings → Features | Enable/disable features |
