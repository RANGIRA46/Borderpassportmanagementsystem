/**
 * Email Templates for Horizon Border Suite
 * High-fidelity, secure email notifications with official government styling
 */

import React from 'react';

// ============================================
// TYPE DEFINITIONS
// ============================================

export enum EmailClassification {
  UNCLASSIFIED = 'UNCLASSIFIED',
  SENSITIVE = 'SENSITIVE',
  CONFIDENTIAL = 'CONFIDENTIAL',
  SECRET = 'SECRET',
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
  classification: EmailClassification;
}

export interface TemplateData {
  recipientName: string;
  recipientEmail: string;
  [key: string]: any;
}

// ============================================
// TEMPLATE COMPONENTS
// ============================================

/**
 * Email Header with Classification Banner
 */
export const EmailHeader = ({ classification = EmailClassification.UNCLASSIFIED }) => {
  const bannerColor = {
    [EmailClassification.UNCLASSIFIED]: '#10b981',
    [EmailClassification.SENSITIVE]: '#f59e0b',
    [EmailClassification.CONFIDENTIAL]: '#ef4444',
    [EmailClassification.SECRET]: '#6366f1',
  };

  return `
    <table style="width: 100%; background-color: ${bannerColor[classification]}; color: white; padding: 12px; text-align: center; font-weight: bold;">
      <tr>
        <td>${classification}</td>
      </tr>
    </table>
    <table style="width: 100%; background-color: #1e293b; color: white; padding: 16px; text-align: center; border-bottom: 3px solid #0f172a;">
      <tr>
        <td>
          <h1 style="margin: 0; font-size: 24px; color: #60a5fa;">🛂 HORIZON BORDER SUITE</h1>
          <p style="margin: 8px 0; font-size: 12px; color: #94a3b8;">Official Government Communication System</p>
        </td>
      </tr>
    </table>
  `;
};

/**
 * Email Footer with Security Notice
 */
export const EmailFooter = () => `
  <table style="width: 100%; background-color: #0f172a; color: #64748b; padding: 16px; font-size: 12px; border-top: 1px solid #334155;">
    <tr>
      <td style="text-align: center;">
        <p style="margin: 8px 0;">
          <strong>⚠️ Security Notice:</strong>
          This is an automated message from the Horizon Border Suite.
          Do not reply to this email.
        </p>
        <p style="margin: 8px 0;">
          <strong>🔒 Data Protection:</strong>
          This communication contains sensitive government information.
          Please keep confidential and do not share.
        </p>
        <hr style="border: none; border-top: 1px solid #334155; margin: 12px 0;">
        <p style="margin: 4px 0; font-size: 11px;">
          Generated: ${new Date().toUTCString()}
        </p>
        <p style="margin: 4px 0; font-size: 11px;">
          © 2026 Ministry of Immigration & Border Security. All Rights Reserved.
        </p>
      </td>
    </tr>
  </table>
`;

// ============================================
// EMAIL TEMPLATES
// ============================================

/**
 * CRITICAL FLAG ALERT EMAIL
 * Sent when a watchlist traveler is scanned at border
 */
export function createFlagAlertEmail(data: TemplateData): EmailTemplate {
  const { recipientName, recipientEmail, travelerName, passportId, flags, scanLocation, scanTime, severity } = data;

  const severityColor = severity === 'high' ? '#dc2626' : severity === 'medium' ? '#ea580c' : '#10b981';
  const severityLabel = severity === 'high' ? '🚨 HIGH RISK' : severity === 'medium' ? '⚠️ MEDIUM RISK' : '✓ LOW RISK';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
        .alert-box { background-color: ${severityColor}; color: white; padding: 16px; border-radius: 8px; margin: 16px 0; }
        .info-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .info-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
        .info-table strong { color: #1e293b; }
        .flag-item { background-color: #fef3c7; padding: 12px; border-left: 4px solid #f59e0b; margin: 8px 0; border-radius: 4px; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc;">
      <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #e2e8f0;">
        <tr><td>
          ${EmailHeader(EmailClassification.SENSITIVE)}
          
          <div style="padding: 24px;">
            <h2 style="color: #1e293b; margin: 0 0 16px 0;">Watchlist Alert - Traveler Flagged</h2>
            
            <div class="alert-box">
              <p style="margin: 0; font-size: 16px;">${severityLabel}</p>
              <p style="margin: 8px 0 0 0; font-size: 14px;">Immediate action may be required</p>
            </div>

            <h3 style="color: #1e293b; margin: 16px 0 8px 0;">Traveler Information</h3>
            <table class="info-table">
              <tr>
                <td style="width: 40%;"><strong>Name:</strong></td>
                <td>${travelerName}</td>
              </tr>
              <tr>
                <td><strong>Passport ID:</strong></td>
                <td style="font-family: monospace;">${passportId}</td>
              </tr>
              <tr>
                <td><strong>Scan Location:</strong></td>
                <td>${scanLocation}</td>
              </tr>
              <tr>
                <td><strong>Scan Time:</strong></td>
                <td>${new Date(scanTime).toLocaleString()}</td>
              </tr>
            </table>

            <h3 style="color: #1e293b; margin: 16px 0 8px 0;">Active Flags</h3>
            ${flags.map(flag => `
              <div class="flag-item">
                <strong>${flag.type}</strong><br>
                <span style="color: #4b5563; font-size: 13px;">${flag.description}</span>
              </div>
            `).join('')}

            <h3 style="color: #1e293b; margin: 16px 0 8px 0;">Required Actions</h3>
            <ol style="color: #4b5563; line-height: 1.8;">
              <li>Verify traveler identity against documentation</li>
              <li>Conduct additional screening as per protocol</li>
              <li>Document all findings in the system</li>
              <li>Contact supervisor if clearance is questioned</li>
            </ol>

            <p style="color: #64748b; font-size: 13px; margin-top: 16px;">
              <strong>Need assistance?</strong> Contact the Border Security Operations Center immediately.
            </p>
          </div>

          ${EmailFooter()}
        </td></tr>
      </table>
    </body>
    </html>
  `;

  const text = `
    WATCHLIST ALERT - TRAVELER FLAGGED
    Severity: ${severity?.toUpperCase() || 'MEDIUM'}
    
    TRAVELER INFORMATION
    Name: ${travelerName}
    Passport ID: ${passportId}
    Scan Location: ${scanLocation}
    Scan Time: ${new Date(scanTime).toLocaleString()}
    
    ACTIVE FLAGS
    ${flags.map(f => `- ${f.type}: ${f.description}`).join('\n')}
    
    REQUIRED ACTIONS
    1. Verify traveler identity against documentation
    2. Conduct additional screening as per protocol
    3. Document all findings in the system
    4. Contact supervisor if clearance is questioned
    
    Classification: SENSITIVE
    Do not share this email with unauthorized personnel.
  `;

  return {
    subject: `🚨 ALERT: Watchlist Traveler Detected - ${travelerName}`,
    html,
    text,
    classification: EmailClassification.SENSITIVE,
  };
}

/**
 * ACCESS GRANT EMAIL
 * Sent when a user's role or permissions are changed
 */
export function createAccessGrantEmail(data: TemplateData): EmailTemplate {
  const { recipientName, recipientEmail, oldRole, newRole, permissions, grantedBy, grantDate } = data;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
        .permission-item { background-color: #dcfce7; padding: 12px; border-left: 4px solid #10b981; margin: 8px 0; border-radius: 4px; }
        .info-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .info-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc;">
      <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #e2e8f0;">
        <tr><td>
          ${EmailHeader(EmailClassification.UNCLASSIFIED)}
          
          <div style="padding: 24px;">
            <h2 style="color: #1e293b; margin: 0 0 16px 0;">✅ Access Grant Notification</h2>
            
            <p style="color: #4b5563; margin-bottom: 16px;">
              Your role in the Horizon Border Suite has been updated. 
              Your new permissions are effective immediately.
            </p>

            <h3 style="color: #1e293b; margin: 16px 0 8px 0;">Role Change Summary</h3>
            <table class="info-table">
              <tr>
                <td style="width: 40%;"><strong>Previous Role:</strong></td>
                <td><code style="background-color: #f1f5f9; padding: 4px 8px; border-radius: 4px;">${oldRole}</code></td>
              </tr>
              <tr>
                <td><strong>New Role:</strong></td>
                <td><code style="background-color: #dcfce7; padding: 4px 8px; border-radius: 4px; color: #166534;">${newRole}</code></td>
              </tr>
              <tr>
                <td><strong>Changed By:</strong></td>
                <td>${grantedBy}</td>
              </tr>
              <tr>
                <td><strong>Effective Date:</strong></td>
                <td>${new Date(grantDate).toLocaleString()}</td>
              </tr>
            </table>

            <h3 style="color: #1e293b; margin: 16px 0 8px 0;">Your New Permissions</h3>
            ${permissions.map(perm => `
              <div class="permission-item">
                <strong>✓ ${perm.label}</strong><br>
                <span style="color: #4b5563; font-size: 13px;">${perm.description}</span>
              </div>
            `).join('')}

            <h3 style="color: #1e293b; margin: 16px 0 8px 0;">Important Reminders</h3>
            <ul style="color: #4b5563; line-height: 1.8;">
              <li>You are responsible for protecting your login credentials</li>
              <li>All actions are logged and auditable</li>
              <li>Unauthorized access attempts are reported immediately</li>
              <li>Report suspicious activity to your supervisor</li>
            </ul>

            <p style="color: #64748b; font-size: 13px; margin-top: 16px;">
              Questions about your permissions? Contact your administrator.
            </p>
          </div>

          ${EmailFooter()}
        </td></tr>
      </table>
    </body>
    </html>
  `;

  const text = `
    ACCESS GRANT NOTIFICATION
    
    Your role in the Horizon Border Suite has been updated.
    
    ROLE CHANGE SUMMARY
    Previous Role: ${oldRole}
    New Role: ${newRole}
    Changed By: ${grantedBy}
    Effective Date: ${new Date(grantDate).toLocaleString()}
    
    YOUR NEW PERMISSIONS
    ${permissions.map(p => `- ${p.label}: ${p.description}`).join('\n')}
    
    IMPORTANT REMINDERS
    - You are responsible for protecting your login credentials
    - All actions are logged and auditable
    - Unauthorized access attempts are reported immediately
    - Report suspicious activity to your supervisor
    
    Questions? Contact your administrator.
  `;

  return {
    subject: `✅ Your Role Has Been Updated to ${newRole}`,
    html,
    text,
    classification: EmailClassification.UNCLASSIFIED,
  };
}

/**
 * DAILY OPERATIONS SUMMARY EMAIL
 * Sent to supervisors with entry/exit statistics
 */
export function createDailyOperationsSummaryEmail(data: TemplateData): EmailTemplate {
  const { recipientName, totalEntries, totalExits, flaggedTravelers, failedAuthentications, date, peakHours } = data;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
        .stat-box { background-color: #dbeafe; padding: 16px; border-radius: 8px; margin: 12px 0; border-left: 4px solid #0284c7; }
        .stat-number { font-size: 28px; font-weight: bold; color: #0c4a6e; }
        .stat-label { color: #475569; font-size: 14px; margin-top: 4px; }
        .alert-box { background-color: #fef3c7; padding: 12px; border-left: 4px solid #f59e0b; margin: 12px 0; border-radius: 4px; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc;">
      <table style="width: 100%; max-width: 700px; margin: 0 auto; background-color: white; border: 1px solid #e2e8f0;">
        <tr><td>
          ${EmailHeader(EmailClassification.UNCLASSIFIED)}
          
          <div style="padding: 24px;">
            <h2 style="color: #1e293b; margin: 0 0 8px 0;">Daily Operations Summary</h2>
            <p style="color: #64748b; margin: 0 0 16px 0;">Report for ${new Date(date).toLocaleDateString()}</p>
            
            <h3 style="color: #1e293b; margin: 16px 0 12px 0;">Border Crossing Statistics</h3>
            <div class="stat-box">
              <div class="stat-number">${totalEntries}</div>
              <div class="stat-label">Total Entries Processed</div>
            </div>
            
            <div class="stat-box">
              <div class="stat-number">${totalExits}</div>
              <div class="stat-label">Total Exits Processed</div>
            </div>

            <h3 style="color: #1e293b; margin: 16px 0 12px 0;">Security Metrics</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f1f5f9;">
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Flagged Travelers</strong></td>
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;"><span style="color: #dc2626; font-weight: bold;">${flaggedTravelers}</span></td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Failed Authentication Attempts</strong></td>
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;"><span style="color: #f59e0b; font-weight: bold;">${failedAuthentications}</span></td>
              </tr>
              <tr style="background-color: #f1f5f9;">
                <td style="padding: 12px;"><strong>Peak Hour</strong></td>
                <td style="padding: 12px; text-align: right;"><span style="font-family: monospace;">${peakHours}</span></td>
              </tr>
            </table>

            ${flaggedTravelers > 5 ? `
              <div class="alert-box">
                <strong>⚠️ Alert:</strong> Higher than average flagged travelers today. 
                Review security alerts for details.
              </div>
            ` : ''}

            <h3 style="color: #1e293b; margin: 16px 0 12px 0;">Recommendations</h3>
            <ul style="color: #4b5563; line-height: 1.8;">
              <li>Review all flagged traveler incidents</li>
              <li>Ensure all staff completed required security training</li>
              <li>Check system logs for any anomalies</li>
              <li>Coordinate with night shift on any pending items</li>
            </ul>

            <p style="color: #64748b; font-size: 13px; margin-top: 16px;">
              For detailed reports and analytics, log into the Horizon Border Suite dashboard.
            </p>
          </div>

          ${EmailFooter()}
        </td></tr>
      </table>
    </body>
    </html>
  `;

  const text = `
    DAILY OPERATIONS SUMMARY
    Report for ${new Date(date).toLocaleDateString()}
    
    BORDER CROSSING STATISTICS
    Total Entries: ${totalEntries}
    Total Exits: ${totalExits}
    
    SECURITY METRICS
    Flagged Travelers: ${flaggedTravelers}
    Failed Authentication Attempts: ${failedAuthentications}
    Peak Hour: ${peakHours}
    
    RECOMMENDATIONS
    - Review all flagged traveler incidents
    - Ensure all staff completed required security training
    - Check system logs for any anomalies
    - Coordinate with night shift on any pending items
    
    For detailed reports, log into the Horizon Border Suite dashboard.
  `;

  return {
    subject: `📊 Daily Operations Summary - ${new Date(date).toLocaleDateString()}`,
    html,
    text,
    classification: EmailClassification.UNCLASSIFIED,
  };
}

/**
 * MFA SETUP CONFIRMATION EMAIL
 */
export function createMFASetupEmail(data: TemplateData): EmailTemplate {
  const { recipientName, mfaMethod, setupDate, backupCodesCount } = data;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc;">
      <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #e2e8f0;">
        <tr><td>
          ${EmailHeader(EmailClassification.SENSITIVE)}
          
          <div style="padding: 24px;">
            <h2 style="color: #1e293b; margin: 0 0 16px 0;">🔐 Multi-Factor Authentication Enabled</h2>
            
            <p style="color: #4b5563; margin-bottom: 16px;">
              Two-factor authentication has been successfully activated for your account.
            </p>

            <div style="background-color: #dcfce7; padding: 16px; border-left: 4px solid #10b981; margin: 16px 0; border-radius: 4px;">
              <strong>✓ MFA is now ACTIVE</strong><br>
              <span style="color: #4b5563; font-size: 13px;">You will need your authenticator app each time you log in</span>
            </div>

            <h3 style="color: #1e293b; margin: 16px 0 8px 0;">MFA Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f1f5f9;">
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; width: 40%;"><strong>Method:</strong></td>
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${mfaMethod}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Enabled:</strong></td>
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${new Date(setupDate).toLocaleString()}</td>
              </tr>
              <tr style="background-color: #f1f5f9;">
                <td style="padding: 12px;"><strong>Backup Codes:</strong></td>
                <td style="padding: 12px;">${backupCodesCount} codes generated</td>
              </tr>
            </table>

            <h3 style="color: #1e293b; margin: 16px 0 8px 0;">Next Steps</h3>
            <ol style="color: #4b5563; line-height: 1.8;">
              <li>Store your backup codes in a secure location</li>
              <li>Keep your authenticator app updated</li>
              <li>Do not share your codes with anyone</li>
              <li>If you lose your device, use a backup code to regain access</li>
            </ol>

            <div style="background-color: #fef3c7; padding: 12px; border-left: 4px solid #f59e0b; margin: 16px 0; border-radius: 4px;">
              <strong>⚠️ Important:</strong> If you didn't enable MFA, contact your administrator immediately.
            </div>
          </div>

          ${EmailFooter()}
        </td></tr>
      </table>
    </body>
    </html>
  `;

  const text = `
    MULTI-FACTOR AUTHENTICATION ENABLED
    
    Two-factor authentication has been successfully activated for your account.
    
    MFA DETAILS
    Method: ${mfaMethod}
    Enabled: ${new Date(setupDate).toLocaleString()}
    Backup Codes: ${backupCodesCount} codes generated
    
    NEXT STEPS
    1. Store your backup codes in a secure location
    2. Keep your authenticator app updated
    3. Do not share your codes with anyone
    4. If you lose your device, use a backup code to regain access
    
    WARNING: If you didn't enable MFA, contact your administrator immediately.
  `;

  return {
    subject: '🔐 Multi-Factor Authentication Has Been Enabled',
    html,
    text,
    classification: EmailClassification.SENSITIVE,
  };
}

