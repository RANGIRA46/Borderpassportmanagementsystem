/**
 * Multi-Factor Authentication (MFA) Component
 * TOTP-based authentication for enhanced security
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MFAVerificationSchema, type MFAVerificationData } from '@/lib/validation/auth.schema';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Shield, AlertTriangle } from 'lucide-react';

interface SecurityCheckpointProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const SecurityCheckpoint: React.FC<SecurityCheckpointProps> = ({
  email,
  onVerify,
  onCancel,
  isLoading = false,
}) => {
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const form = useForm<MFAVerificationData>({
    resolver: zodResolver(MFAVerificationSchema),
  });

  const handleSubmit = async (data: MFAVerificationData) => {
    try {
      setVerifyError(null);
      await onVerify(data.code);
    } catch (error) {
      setVerifyError(
        error instanceof Error ? error.message : 'Invalid authentication code'
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-12">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Security Verification
          </h1>
          <p className="text-gray-600">
            Two-factor authentication is required for your account
          </p>
        </div>

        {/* Error Alert */}
        {verifyError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{verifyError}</AlertDescription>
          </Alert>
        )}

        {/* Standard MFA Form */}
        {!showBackupCodes && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Authenticating as:</strong>
                </p>
                <p className="text-sm font-mono text-blue-700 mt-1">{email}</p>
              </div>

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authentication Code</FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <Input
                            key={index}
                            type="text"
                            maxLength={1}
                            inputMode="numeric"
                            pattern="[0-9]"
                            placeholder="0"
                            value={field.value[index] || ''}
                            onChange={(e) => {
                              const newCode = field.value.split('');
                              newCode[index] = e.target.value;
                              field.onChange(newCode.join(''));

                              // Auto-focus next field
                              if (e.target.value && index < 5) {
                                const nextInput = document.querySelector(
                                  `input[placeholder="${index + 1}"]`
                                ) as HTMLInputElement;
                                nextInput?.focus();
                              }
                            }}
                            className="w-12 h-12 text-center text-lg font-semibold border-gray-300"
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the 6-digit code from your authenticator app
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Tip</AlertTitle>
                <AlertDescription>
                  Using an authenticator app? Look for apps like Google Authenticator, Microsoft
                  Authenticator, or Authy
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isLoading || !form.watch('code')}
                  className="flex-1"
                >
                  {isLoading ? 'Verifying...' : 'Verify'}
                </Button>
              </div>

              {/* Backup Codes Link */}
              <button
                type="button"
                onClick={() => setShowBackupCodes(true)}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Use backup code instead
              </button>
            </form>
          </Form>
        )}

        {/* Backup Codes Form */}
        {showBackupCodes && (
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Backup Codes</AlertTitle>
              <AlertDescription>
                You can use one of your backup codes if you don't have access to your authenticator
                app
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Backup Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="XXXX-XXXX-XXXX-XXXX"
                          {...field}
                          className="font-mono"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter one of your 8-digit backup codes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBackupCodes(false)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Footer Help Text */}
        <p className="text-xs text-gray-500 text-center mt-8">
          Having trouble? Contact your system administrator for assistance
        </p>
      </div>
    </div>
  );
};

/**
 * MFA Setup Component - For initial configuration
 */
interface MFASetupProps {
  email: string;
  onComplete: () => void;
  isLoading?: boolean;
}

export const MFASetup: React.FC<MFASetupProps> = ({
  email,
  onComplete,
  isLoading = false,
}) => {
  const [step, setStep] = useState<'info' | 'scan' | 'verify' | 'backup'>('info');
  const [backupCodes] = useState<string[]>([
    'ABCD-1234-XXXX-XXXX',
    'EFGH-5678-XXXX-XXXX',
    'IJKL-9012-XXXX-XXXX',
    'MNOP-3456-XXXX-XXXX',
    'QRST-7890-XXXX-XXXX',
  ]);

  return (
    <div className="w-full max-w-2xl mx-auto py-12">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Set Up Two-Factor Authentication
        </h1>
        <p className="text-gray-600 mb-8">
          Enhance your account security with multi-factor authentication
        </p>

        {/* Step 1: Information */}
        {step === 'info' && (
          <div className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Why 2FA?</AlertTitle>
              <AlertDescription>
                Two-factor authentication adds an extra layer of security to your account by
                requiring something you know (password) and something you have (authenticator app)
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">What You'll Need:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>An authenticator app (Google Authenticator, Microsoft Authenticator, Authy, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>A smartphone or device to run the app</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>A secure location to store your backup codes</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setStep('scan')}
              disabled={isLoading}
              className="w-full"
            >
              Continue to Setup
            </Button>
          </div>
        )}

        {/* Step 2: Scan QR Code */}
        {step === 'scan' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Step 1: Scan QR Code
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Use your authenticator app to scan this QR code:
              </p>
              <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center mb-4">
                <div className="text-gray-400 text-sm">
                  [QR Code Placeholder]
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Can't scan? Enter this code manually: JBSWY3DPEBLW64TMMQ2HY2LQEBSHGQ3JMZXS23LOMNXW26LQEBSHGQ3J
              </p>
            </div>

            <Button
              onClick={() => setStep('verify')}
              disabled={isLoading}
              className="w-full"
            >
              Next
            </Button>
          </div>
        )}

        {/* Step 3: Verify */}
        {step === 'verify' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Step 2: Verify Setup
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter the 6-digit code from your authenticator app:
              </p>
              <Input
                placeholder="000000"
                type="text"
                maxLength={6}
                className="text-center text-2xl tracking-widest mb-4"
              />
            </div>

            <Button
              onClick={() => setStep('backup')}
              disabled={isLoading}
              className="w-full"
            >
              Verify & Continue
            </Button>
          </div>
        )}

        {/* Step 4: Backup Codes */}
        {step === 'backup' && (
          <div className="space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Save Your Backup Codes</AlertTitle>
              <AlertDescription>
                Store these backup codes in a safe place. You can use them to access your account if
                you lose access to your authenticator app.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200"
                >
                  <span className="text-xs text-gray-500 font-mono">{code}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  navigator.clipboard.writeText(backupCodes.join('\n'));
                }}
              >
                Copy Codes
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const element = document.createElement('a');
                  element.setAttribute(
                    'href',
                    `data:text/plain;charset=utf-8,${encodeURIComponent(
                      backupCodes.join('\n')
                    )}`
                  );
                  element.setAttribute('download', 'backup-codes.txt');
                  element.style.display = 'none';
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
              >
                Download Codes
              </Button>
            </div>

            <Button
              onClick={onComplete}
              disabled={isLoading}
              className="w-full"
            >
              Complete Setup
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityCheckpoint;

