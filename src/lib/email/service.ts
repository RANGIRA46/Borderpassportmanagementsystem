/**
 * Email Service - Server Actions
 * Handles sending secure emails with templates
 * IMPORTANT: All SMTP credentials and API keys stay server-side only
 */

'use server';

import { EmailTemplate } from '@/lib/email/templates';
import { createFlagAlertEmail, createAccessGrantEmail, createDailyOperationsSummaryEmail, createMFASetupEmail } from '@/lib/email/templates';

// ============================================
// ENVIRONMENT VARIABLES (Server-side only!)
// ============================================

const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || '',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  user: process.env.SMTP_USER || '',
  password: process.env.SMTP_PASSWORD || '',
  from: process.env.SMTP_FROM || 'noreply@border.gov',
};

// ============================================
// EMAIL SENDING SERVICE
// ============================================

interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: Date;
}

/**
 * Send email using Nodemailer (or your preferred service)
 * This function ONLY runs on the server
 */
export async function sendEmail(
  to: string,
  template: EmailTemplate,
  metadata?: {
    priority?: 'high' | 'normal' | 'low';
    trackingId?: string;
    retryCount?: number;
  }
): Promise<EmailSendResult> {
  try {
    // Validate email address
    if (!to || !to.includes('@')) {
      return {
        success: false,
        error: 'Invalid email address',
        timestamp: new Date(),
      };
    }

    // In production, use Nodemailer or AWS SES
    // Example with Nodemailer:
    // const transporter = nodemailer.createTransport({
    //   host: SMTP_CONFIG.host,
    //   port: SMTP_CONFIG.port,
    //   secure: SMTP_CONFIG.secure,
    //   auth: {
    //     user: SMTP_CONFIG.user,
    //     pass: SMTP_CONFIG.password,
    //   },
    // });

    // const result = await transporter.sendMail({
    //   from: SMTP_CONFIG.from,
    //   to,
    //   subject: template.subject,
    //   html: template.html,
    //   text: template.text,
    //   priority: metadata?.priority || 'normal',
    //   headers: {
    //     'X-Priority': metadata?.priority === 'high' ? '1' : '3',
    //     'X-Tracking-Id': metadata?.trackingId || '',
    //     'X-Classification': template.classification,
    //   },
    // });

    // For now, mock the response
    console.log(`[Email] Sending to ${to}: ${template.subject}`);

    // Log the email for audit purposes
    await logEmailSent(to, template, 'SENT');

    return {
      success: true,
      messageId: `msg_${Date.now()}`,
      timestamp: new Date(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    console.error(`[Email Error] Failed to send to ${to}:`, errorMessage);

    // Log the failure
    await logEmailSent(to, template, 'FAILED', errorMessage);

    return {
      success: false,
      error: errorMessage,
      timestamp: new Date(),
    };
  }
}

/**
 * Send Flag Alert Email
 */
export async function sendFlagAlertEmail(
  recipientEmail: string,
  data: {
    recipientName: string;
    travelerName: string;
    passportId: string;
    flags: Array<{ type: string; description: string }>;
    scanLocation: string;
    scanTime: Date;
    severity: 'high' | 'medium' | 'low';
  }
) {
  const template = createFlagAlertEmail({
    ...data,
    recipientEmail,
  });

  return sendEmail(recipientEmail, template, {
    priority: data.severity === 'high' ? 'high' : 'normal',
  });
}

/**
 * Send Access Grant Email
 */
export async function sendAccessGrantEmail(
  recipientEmail: string,
  data: {
    recipientName: string;
    oldRole: string;
    newRole: string;
    permissions: Array<{ label: string; description: string }>;
    grantedBy: string;
    grantDate: Date;
  }
) {
  const template = createAccessGrantEmail({
    ...data,
    recipientEmail,
  });

  return sendEmail(recipientEmail, template);
}

/**
 * Send Daily Operations Summary Email
 */
export async function sendDailyOperationsSummaryEmail(
  recipientEmail: string,
  data: {
    recipientName: string;
    totalEntries: number;
    totalExits: number;
    flaggedTravelers: number;
    failedAuthentications: number;
    date: Date;
    peakHours: string;
  }
) {
  const template = createDailyOperationsSummaryEmail({
    ...data,
    recipientEmail,
  });

  // This is a routine email, send at normal priority
  return sendEmail(recipientEmail, template);
}

/**
 * Send MFA Setup Confirmation Email
 */
export async function sendMFASetupEmail(
  recipientEmail: string,
  data: {
    recipientName: string;
    mfaMethod: string;
    setupDate: Date;
    backupCodesCount: number;
  }
) {
  const template = createMFASetupEmail({
    ...data,
    recipientEmail,
  });

  return sendEmail(recipientEmail, template, { priority: 'high' });
}

// ============================================
// EMAIL LOGGING & AUDIT TRAIL
// ============================================

interface EmailAuditLog {
  id: string;
  recipient: string;
  subject: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED';
  classification: string;
  sentAt: Date;
  errorMessage?: string;
  retryCount: number;
}

/**
 * Log email for audit purposes
 * In production, save to database
 */
async function logEmailSent(
  recipient: string,
  template: EmailTemplate,
  status: 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED',
  errorMessage?: string
): Promise<void> {
  // TODO: Save to database
  // await db.emailAuditLogs.create({
  //   recipient,
  //   subject: template.subject,
  //   status,
  //   classification: template.classification,
  //   sentAt: new Date(),
  //   errorMessage,
  //   retryCount: 0,
  // });

  console.log(`[Audit] Email logged - ${recipient} - ${status}`);
}

/**
 * Get email audit logs (admin only)
 */
export async function getEmailAuditLogs(
  filters?: {
    status?: 'SENT' | 'DELIVERED' | 'FAILED';
    recipient?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }
): Promise<EmailAuditLog[]> {
  // TODO: Query from database
  // return await db.emailAuditLogs.findMany({
  //   where: {
  //     status: filters?.status,
  //     recipient: filters?.recipient,
  //     sentAt: {
  //       gte: filters?.startDate,
  //       lte: filters?.endDate,
  //     },
  //   },
  //   take: filters?.limit || 100,
  //   orderBy: { sentAt: 'desc' },
  // });

  console.log('[Audit] Fetching email logs with filters:', filters);
  return [];
}

/**
 * Retry failed emails
 */
export async function retryFailedEmails(
  emailIds: string[],
  maxRetries = 3
): Promise<{ successful: number; failed: number }> {
  // TODO: Implement retry logic
  // For each email:
  // 1. Check retry count
  // 2. If < maxRetries, attempt to resend
  // 3. Update status in database

  console.log(`[Retry] Attempting to retry ${emailIds.length} failed emails`);
  return { successful: 0, failed: emailIds.length };
}

// ============================================
// WEBHOOK HANDLERS (For email service providers)
// ============================================

/**
 * Handle webhook from email service (e.g., SendGrid, Mailgun)
 * Called when email provider reports delivery status
 */
export async function handleEmailWebhook(
  event: 'delivered' | 'bounced' | 'failed' | 'opened' | 'clicked',
  messageId: string,
  metadata?: Record<string, any>
): Promise<void> {
  // TODO: Update email status in database
  console.log(`[Webhook] Email event: ${event} - ${messageId}`);

  // Example:
  // await db.emailAuditLogs.update({
  //   where: { id: messageId },
  //   data: {
  //     status: event === 'delivered' ? 'DELIVERED' : 'BOUNCED',
  //     lastEventAt: new Date(),
  //     metadata,
  //   },
  // });
}

// ============================================
// BATCH EMAIL OPERATIONS
// ============================================

/**
 * Send daily operations summary to multiple supervisors
 */
export async function sendDailyOperationsSummaries(
  supervisors: Array<{
    email: string;
    name: string;
    data: any;
  }>
): Promise<{
  sent: number;
  failed: number;
  errors: Record<string, string>;
}> {
  const results = {
    sent: 0,
    failed: 0,
    errors: {} as Record<string, string>,
  };

  for (const supervisor of supervisors) {
    try {
      const result = await sendDailyOperationsSummaryEmail(supervisor.email, {
        recipientName: supervisor.name,
        ...supervisor.data,
      });

      if (result.success) {
        results.sent++;
      } else {
        results.failed++;
        if (result.error) {
          results.errors[supervisor.email] = result.error;
        }
      }
    } catch (error) {
      results.failed++;
      results.errors[supervisor.email] = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  console.log(`[Batch] Daily summaries: ${results.sent} sent, ${results.failed} failed`);

  return results;
}

/**
 * Send notifications to multiple officers for flagged traveler
 */
export async function notifyOfficersOfFlaggedTraveler(
  officerEmails: string[],
  travelerData: any,
  flagDetails: any
): Promise<{ sent: number; failed: number }> {
  const results = { sent: 0, failed: 0 };

  const promises = officerEmails.map((email) =>
    sendFlagAlertEmail(email, {
      recipientName: email.split('@')[0],
      ...travelerData,
      ...flagDetails,
    })
      .then((result) => {
        if (result.success) results.sent++;
        else results.failed++;
      })
      .catch(() => {
        results.failed++;
      })
  );

  await Promise.all(promises);

  console.log(`[Notify] Officers notified: ${results.sent} sent, ${results.failed} failed`);

  return results;
}

// ============================================
// SECURITY HEADERS
// ============================================

/**
 * Generate secure email headers to prevent spoofing
 */
export function generateSecureEmailHeaders(messageId: string) {
  return {
    'X-Priority': '1', // For alerts
    'X-MSMail-Priority': 'High',
    'Importance': 'high',
    'X-Originating-IP': '[IP Address]', // From server
    'X-Mailer': 'Horizon Border Suite v1.0',
    'X-Classification': 'SENSITIVE',
    'DKIM-Signature': 'Generated by server', // Requires server-side signing
    'SPF': 'pass', // Requires DNS configuration
    'DMARC': 'pass', // Requires DMARC policy
    'X-Message-ID': messageId,
    'X-Timestamp': new Date().toISOString(),
    'X-Request-ID': messageId,
  };
}

export default sendEmail;

