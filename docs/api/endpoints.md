# API Reference

This document provides a quick-reference summary of all API endpoints.  
For the full machine-readable specification, see [`openapi.yaml`](./openapi.yaml).

**Base path:** `/make-server-8ee81f4f`

---

## Authentication

Endpoints marked 🔒 require a Supabase JWT in the request header:

```
Authorization: Bearer <token>
```

---

## Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Server health check |

---

## Applications

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/applications/passport` | | Submit passport application |
| `POST` | `/applications/visa` | | Submit visa application |
| `POST` | `/applications/permit` | | Submit permit application |
| `POST` | `/applications/citizenship` | | Submit citizenship application |
| `POST` | `/applications/laissez-passer` | | Submit emergency travel document |
| `POST` | `/applications/refugee` | | Submit refugee services request |
| `POST` | `/applications/diaspora` | | Submit diaspora services request |
| `GET` | `/applications/status/:refNumber` | | Get application status |
| `GET` | `/applications/user/:email` | | Get all applications for user |
| `PUT` | `/applications/:refNumber/status` | 🔒 | Update application status |

### Example: Submit passport application

```bash
curl -X POST https://<project>.supabase.co/functions/v1/server/make-server-8ee81f4f/applications/passport \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "dateOfBirth": "1990-01-15",
    "nationality": "Rwandan",
    "passportType": "ordinary"
  }'
```

**Response:**

```json
{
  "success": true,
  "referenceNumber": "PASS-1700000000000-456",
  "message": "Passport application submitted successfully",
  "estimatedProcessingTime": "10-15 business days"
}
```

---

## Documents

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/documents` | | Save document metadata |
| `GET` | `/applications/:refNumber/documents` | | Get documents for application |

---

## Appointments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/appointments` | | Book an appointment |
| `GET` | `/appointments/user/:email` | | Get user appointments |

---

## Statistics

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/statistics` | 🔒 | Get system statistics |

---

## Error Responses

All errors return a JSON body:

```json
{
  "error": "Human-readable error message"
}
```

| HTTP Status | Meaning |
|-------------|---------|
| `400` | Bad request / invalid input |
| `401` | Unauthorized — missing or invalid JWT |
| `404` | Resource not found |
| `500` | Internal server error |

---

## Application Statuses

| Status | Description |
|--------|-------------|
| `submitted` | Application received and awaiting review |
| `under_review` | Being reviewed by an immigration official |
| `awaiting_documents` | Additional documents required |
| `approved` | Application approved |
| `rejected` | Application rejected |
| `ready_for_collection` | Document ready for collection |
