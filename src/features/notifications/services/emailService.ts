/**
 * Email notification service.
 *
 * In production this calls the backend Supabase Edge Function which
 * handles actual SMTP/SendGrid delivery.  In development / preview mode
 * it logs to the console so the rest of the UI can be exercised without
 * real credentials.
 */

export interface EmailPayload {
  to: string;
  subject: string;
  templateId: EmailTemplate;
  variables: Record<string, string | number>;
  replyTo?: string;
}

export type EmailTemplate =
  | "appointmentReminder"
  | "applicationApproved"
  | "applicationRejected"
  | "documentRequest"
  | "passwordReset"
  | "accountVerification"
  | "renewalReminder"
  | "statusUpdate";

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const API_BASE =
  typeof window !== "undefined"
    ? (import.meta as unknown as { env: Record<string, string> }).env
        ?.VITE_API_BASE_URL ?? "/make-server-8ee81f4f"
    : "/make-server-8ee81f4f";

async function postEmail(payload: EmailPayload): Promise<EmailResult> {
  try {
    const response = await fetch(`${API_BASE}/notifications/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: text };
    }
    const data = (await response.json()) as { messageId?: string };
    return { success: true, messageId: data.messageId };
  } catch (err) {
    console.warn("[emailService] fetch failed – logging locally", payload);
    return {
      success: false,
      error: err instanceof Error ? err.message : "network error",
    };
  }
}

// ── Public helpers ───────────────────────────────────────────────────────────

export async function sendAppointmentReminder(
  to: string,
  appointmentDate: string,
  location: string,
  referenceNumber: string
): Promise<EmailResult> {
  return postEmail({
    to,
    subject: `Appointment Reminder – ${appointmentDate}`,
    templateId: "appointmentReminder",
    variables: { appointmentDate, location, referenceNumber },
  });
}

export async function sendApplicationApproved(
  to: string,
  applicantName: string,
  referenceNumber: string,
  passportNumber: string
): Promise<EmailResult> {
  return postEmail({
    to,
    subject: "Your Passport Application Has Been Approved",
    templateId: "applicationApproved",
    variables: { applicantName, referenceNumber, passportNumber },
  });
}

export async function sendApplicationRejected(
  to: string,
  applicantName: string,
  referenceNumber: string,
  reason: string
): Promise<EmailResult> {
  return postEmail({
    to,
    subject: "Passport Application Status Update",
    templateId: "applicationRejected",
    variables: { applicantName, referenceNumber, reason },
  });
}

export async function sendDocumentRequest(
  to: string,
  applicantName: string,
  referenceNumber: string,
  documents: string
): Promise<EmailResult> {
  return postEmail({
    to,
    subject: "Additional Documents Required",
    templateId: "documentRequest",
    variables: { applicantName, referenceNumber, documents },
  });
}

export async function sendPasswordReset(
  to: string,
  resetLink: string
): Promise<EmailResult> {
  return postEmail({
    to,
    subject: "Reset Your Password",
    templateId: "passwordReset",
    variables: { resetLink },
  });
}

export async function sendAccountVerification(
  to: string,
  verificationLink: string,
  userName: string
): Promise<EmailResult> {
  return postEmail({
    to,
    subject: "Verify Your Account",
    templateId: "accountVerification",
    variables: { verificationLink, userName },
  });
}

export async function sendRenewalReminder(
  to: string,
  applicantName: string,
  expiryDate: string,
  daysUntilExpiry: number
): Promise<EmailResult> {
  return postEmail({
    to,
    subject: `Passport Renewal Reminder – Expires ${expiryDate}`,
    templateId: "renewalReminder",
    variables: { applicantName, expiryDate, daysUntilExpiry },
  });
}

export async function sendStatusUpdate(
  to: string,
  applicantName: string,
  referenceNumber: string,
  newStatus: string,
  statusNote: string
): Promise<EmailResult> {
  return postEmail({
    to,
    subject: `Application Status Updated – ${referenceNumber}`,
    templateId: "statusUpdate",
    variables: { applicantName, referenceNumber, newStatus, statusNote },
  });
}
