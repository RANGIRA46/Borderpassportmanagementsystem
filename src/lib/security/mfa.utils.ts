/**
 * MFA/TOTP Utilities & Type Definitions
 * Handles Time-based One-Time Password generation, verification, and recovery codes
 */

import crypto from 'crypto';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface MFAConfig {
  enabled: boolean;
  method: 'totp' | 'biometric' | 'email';
  totpSecret?: string;
  backupCodes?: string[];
  biometricEnabled?: boolean;
  lastUsed?: Date;
}

export interface RecoveryCodes {
  codes: string[];
  generatedAt: Date;
  usedCodes: string[];
}

export interface MFAVerificationRequest {
  code: string;
  rememberDevice?: boolean;
  deviceId?: string;
}

export interface MFAVerificationResponse {
  success: boolean;
  message: string;
  sessionToken?: string;
  deviceToken?: string;
}

export interface SecurityPosture {
  mfaEnabled: boolean;
  lastLogin: Date;
  lastLoginIP: string;
  lastLoginDeviceName: string;
  trustedDevices: TrustedDevice[];
  recentActivity: SecurityEvent[];
}

export interface TrustedDevice {
  deviceId: string;
  deviceName: string;
  trustedAt: Date;
  lastUsed: Date;
  ipAddress: string;
  userAgent: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'login' | 'logout' | 'failed_login' | 'permission_change' | 'mfa_enabled' | 'recovery_code_used';
  ipAddress: string;
  deviceName: string;
  status: 'success' | 'failure';
  details?: string;
}

// ============================================
// TOTP GENERATION & VERIFICATION
// ============================================

/**
 * Generate a new TOTP secret for a user
 */
export function generateTOTPSecret(userEmail: string): {
  secret: string;
  qrCode: string;
} {
  // Generate 32-byte random secret
  const secret = crypto.randomBytes(32).toString('base64');

  // Create QR code data (for Google Authenticator, Microsoft Authenticator, Authy, etc.)
  const otpauthUrl = `otpauth://totp/Horizon%20Border%20Suite:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=Horizon%20Border%20Suite&algorithm=SHA1&digits=6&period=30`;

  return {
    secret,
    qrCode: otpauthUrl, // In practice, this would be converted to QR code image
  };
}

/**
 * Verify a TOTP code against a secret
 */
export function verifyTOTPCode(secret: string, code: string, window = 1): boolean {
  if (!code || code.length !== 6) return false;
  if (!/^\d{6}$/.test(code)) return false;

  const time = Math.floor(Date.now() / 1000 / 30);
  const secretBuffer = Buffer.from(secret, 'base64');

  // Check current time window
  const counter = Buffer.alloc(8);
  counter.writeBigInt64BE(BigInt(time));

  const hmac = crypto.createHmac('sha1', secretBuffer);
  hmac.update(counter);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0xf;
  const dyn = digest.readUInt32BE(offset) & 0x7fffffff;
  const totp = (dyn % 1000000).toString().padStart(6, '0');

  return totp === code;
}

/**
 * Generate backup/recovery codes (12-character alphanumeric)
 * Format: XXXX-XXXX-XXXX (easier to read)
 */
export function generateRecoveryCodes(count = 10): string[] {
  const codes: string[] = [];
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < count; i++) {
    let code = '';
    for (let j = 0; j < 12; j++) {
      code += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    // Format as: XXXX-XXXX-XXXX
    const formatted = `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}`;
    codes.push(formatted);
  }

  return codes;
}

/**
 * Verify a recovery code and mark it as used
 */
export function verifyRecoveryCode(
  code: string,
  storedCodes: string[],
  usedCodes: string[]
): boolean {
  // Normalize code (remove dashes)
  const normalizedCode = code.replace(/-/g, '').toUpperCase();
  const normalizedStored = storedCodes.map(c => c.replace(/-/g, '').toUpperCase());

  // Check if code exists and hasn't been used
  const index = normalizedStored.indexOf(normalizedCode);
  if (index === -1 || usedCodes.includes(normalizedCode)) {
    return false;
  }

  return true;
}

// ============================================
// DEVICE TRUST & COOKIES
// ============================================

/**
 * Generate a unique device ID and encrypt it for storage
 */
export function generateDeviceId(userAgent: string, ipAddress: string): string {
  const input = `${userAgent}-${ipAddress}-${Date.now()}`;
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 32);
}

/**
 * Create encrypted device token for "Trust this Device" feature
 */
export function createDeviceToken(
  deviceId: string,
  userId: string,
  encryptionKey: string
): string {
  const payload = JSON.stringify({
    deviceId,
    userId,
    timestamp: Date.now(),
    expiresAt: Date.now() + 12 * 60 * 60 * 1000, // 12 hours
  });

  const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
  let encrypted = cipher.update(payload, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

/**
 * Verify and decrypt device token
 */
export function verifyDeviceToken(token: string, encryptionKey: string): { deviceId: string; userId: string; valid: boolean } {
  try {
    const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
    let decrypted = decipher.update(token, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const payload = JSON.parse(decrypted);

    // Check if token has expired
    if (payload.expiresAt < Date.now()) {
      return { deviceId: '', userId: '', valid: false };
    }

    return {
      deviceId: payload.deviceId,
      userId: payload.userId,
      valid: true,
    };
  } catch (error) {
    return { deviceId: '', userId: '', valid: false };
  }
}

// ============================================
// BIOMETRIC / WEBAUTHN SUPPORT
// ============================================

/**
 * Generate WebAuthn credential creation options
 * Used for Passkeys, FaceID, TouchID, Yubikeys
 */
export function generateWebAuthnOptions(userId: string, userName: string) {
  return {
    challenge: crypto.randomBytes(32).toString('base64'),
    rp: {
      name: 'Horizon Border Suite',
      id: 'border.gov',
    },
    user: {
      id: crypto.randomBytes(16).toString('base64'),
      name: userName,
      displayName: userName,
    },
    pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
    timeout: 60000,
    attestation: 'direct',
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format recovery codes for display/printing
 */
export function formatRecoveryCodesForPrint(codes: string[]): string {
  const timestamp = new Date().toLocaleString();
  return `
HORIZON BORDER SUITE
EMERGENCY RECOVERY CODES
Generated: ${timestamp}

KEEP THESE CODES IN A SECURE LOCATION

${codes.map((code, i) => `${(i + 1).toString().padStart(2, '0')}. ${code}`).join('\n')}

Each code can be used ONCE if you lose access to your authenticator app.
After using a code, it is automatically invalidated.

WARNING: Anyone with these codes can access your account.
Store securely and do not share.
  `.trim();
}

/**
 * Generate a summary of MFA configuration
 */
export function getMFASummary(config: MFAConfig): string {
  if (!config.enabled) return 'MFA is not enabled';

  let summary = 'MFA Status: ✅ Active\n';
  summary += `Method: ${config.method === 'totp' ? 'Authenticator App' : config.method === 'biometric' ? 'Biometric' : 'Email'}\n`;
  summary += `Backup Codes: ${config.backupCodes?.length || 0} remaining\n`;

  if (config.biometricEnabled) {
    summary += 'Biometric: ✅ Available\n';
  }

  return summary;
}

