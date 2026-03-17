/**
 * SMS notification service.
 *
 * Calls the backend Edge Function which uses Twilio or AWS SNS.
 * Gracefully degrades to a console warning when the endpoint is unreachable.
 */

export interface SmsPayload {
  to: string; // E.164 format e.g. "+250788123456"
  templateId: SmsTemplate;
  variables: Record<string, string | number>;
}

export type SmsTemplate =
  | "appointmentReminder"
  | "statusUpdate"
  | "otpVerification"
  | "borderAlert"
  | "renewalReminder";

export interface SmsResult {
  success: boolean;
  messageSid?: string;
  error?: string;
}

const API_BASE =
  typeof window !== "undefined"
    ? (import.meta as unknown as { env: Record<string, string> }).env
        ?.VITE_API_BASE_URL ?? "/make-server-8ee81f4f"
    : "/make-server-8ee81f4f";

// Template messages (used as fallback description for logging)
const SMS_TEMPLATES: Record<SmsTemplate, string> = {
  appointmentReminder:
    "Reminder: Your appointment is on {{appointmentDate}} at {{location}}. Ref: {{referenceNumber}}",
  statusUpdate:
    "Your application {{referenceNumber}} status has been updated to: {{status}}",
  otpVerification:
    "Your Border Passport Management System verification code is: {{otp}}. Valid for 10 minutes.",
  borderAlert:
    "Border alert: {{alertMessage}}. Reference: {{referenceNumber}}",
  renewalReminder:
    "Your passport expires on {{expiryDate}}. Start your renewal now to avoid delays.",
};

async function postSms(payload: SmsPayload): Promise<SmsResult> {
  try {
    const response = await fetch(`${API_BASE}/notifications/sms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: text };
    }
    const data = (await response.json()) as { messageSid?: string };
    return { success: true, messageSid: data.messageSid };
  } catch (err) {
    const template = SMS_TEMPLATES[payload.templateId];
    console.warn("[smsService] fetch failed – would have sent:", {
      to: payload.to,
      message: template,
      variables: payload.variables,
    });
    return {
      success: false,
      error: err instanceof Error ? err.message : "network error",
    };
  }
}

// ── Rate limiting (simple in-memory token bucket) ──────────────────────────

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 SMS per phone per minute

function isRateLimited(phoneNumber: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(phoneNumber) ?? []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  rateLimitMap.set(phoneNumber, timestamps);
  return false;
}

// ── Public helpers ────────────────────────────────────────────────────────────

export async function sendAppointmentSmsReminder(
  to: string,
  appointmentDate: string,
  location: string,
  referenceNumber: string
): Promise<SmsResult> {
  if (isRateLimited(to)) return { success: false, error: "rate_limited" };
  return postSms({
    to,
    templateId: "appointmentReminder",
    variables: { appointmentDate, location, referenceNumber },
  });
}

export async function sendStatusSms(
  to: string,
  referenceNumber: string,
  status: string
): Promise<SmsResult> {
  if (isRateLimited(to)) return { success: false, error: "rate_limited" };
  return postSms({
    to,
    templateId: "statusUpdate",
    variables: { referenceNumber, status },
  });
}

export async function sendOtpSms(
  to: string,
  otp: string
): Promise<SmsResult> {
  if (isRateLimited(to)) return { success: false, error: "rate_limited" };
  return postSms({
    to,
    templateId: "otpVerification",
    variables: { otp },
  });
}

export async function sendBorderAlert(
  to: string,
  alertMessage: string,
  referenceNumber: string
): Promise<SmsResult> {
  if (isRateLimited(to)) return { success: false, error: "rate_limited" };
  return postSms({
    to,
    templateId: "borderAlert",
    variables: { alertMessage, referenceNumber },
  });
}

export async function sendRenewalSmsReminder(
  to: string,
  expiryDate: string
): Promise<SmsResult> {
  if (isRateLimited(to)) return { success: false, error: "rate_limited" };
  return postSms({
    to,
    templateId: "renewalReminder",
    variables: { expiryDate },
  });
}
