/**
 * MFA Verification Component
 * High-security 6-digit TOTP input with animations and fallback mechanisms
 */

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Shield, Copy, Check, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const TOTPVerificationSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only digits'),
  rememberDevice: z.boolean().optional(),
});

const RecoveryCodeSchema = z.object({
  recoveryCode: z
    .string()
    .min(8, 'Recovery code must be at least 8 characters')
    .regex(/^[A-Z0-9\-]+$/, 'Invalid recovery code format'),
});

type TOTPVerificationForm = z.infer<typeof TOTPVerificationSchema>;
type RecoveryCodeForm = z.infer<typeof RecoveryCodeSchema>;

// ============================================
// MAIN MFA VERIFICATION COMPONENT
// ============================================

interface MFAVerificationProps {
  email: string;
  onVerify: (code: string, rememberDevice: boolean) => Promise<void>;
  onRecoveryCodeSubmit: (code: string) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const MFAVerification: React.FC<MFAVerificationProps> = ({
  email,
  onVerify,
  onRecoveryCodeSubmit,
  isLoading = false,
  onCancel,
}) => {
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const totpForm = useForm<TOTPVerificationForm>({
    resolver: zodResolver(TOTPVerificationSchema),
    defaultValues: { code: '', rememberDevice: false },
  });

  const recoveryForm = useForm<RecoveryCodeForm>({
    resolver: zodResolver(RecoveryCodeSchema),
  });

  // Handle 6-digit input with auto-focus and auto-submit
  const handleTOTPChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits

    const newCode = totpForm.getValues('code').split('');
    newCode[index] = value;
    const fullCode = newCode.join('');

    totpForm.setValue('code', fullCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (fullCode.length === 6 && /^\d{6}$/.test(fullCode)) {
      handleTOTPSubmit(fullCode);
    }
  };

  const handleTOTPBackspace = (index: number, event: React.KeyboardEvent) => {
    if (event.key === 'Backspace') {
      const newCode = totpForm.getValues('code').split('');
      newCode[index] = '';
      totpForm.setValue('code', newCode.join(''));

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleTOTPSubmit = async (code: string) => {
    try {
      setVerifyError(null);
      setShakeAnimation(false);

      const rememberDevice = totpForm.getValues('rememberDevice');
      await onVerify(code, rememberDevice);

      // Success animation
      setSuccessAnimation(true);
      setTimeout(() => {
        setSuccessAnimation(false);
      }, 1000);

      toast.success('MFA Verification Successful!');
    } catch (error) {
      setVerifyError(
        error instanceof Error ? error.message : 'Invalid authentication code'
      );
      setShakeAnimation(true);
      totpForm.setValue('code', ''); // Clear input
      inputRefs.current[0]?.focus();

      // Reset shake animation
      setTimeout(() => setShakeAnimation(false), 500);

      toast.error('Invalid code. Please try again.');
    }
  };

  const handleRecoveryCodeSubmit = async (data: RecoveryCodeForm) => {
    try {
      setVerifyError(null);
      await onRecoveryCodeSubmit(data.recoveryCode);
      toast.success('Recovery code verified!');
    } catch (error) {
      setVerifyError(
        error instanceof Error ? error.message : 'Invalid recovery code'
      );
      toast.error('Invalid recovery code.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 to-blue-900 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Security Verification</h1>
          </div>
          <p className="text-sm text-sky-200">
            Multi-factor authentication required for your account
          </p>
        </div>

        <div className="p-6">
          {/* Email Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>Authenticating as:</strong>
            </p>
            <p className="text-sm font-mono text-blue-700 mt-1">{email}</p>
          </div>

          {/* Error Alert */}
          {verifyError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>{verifyError}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="totp" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="totp">Authenticator App</TabsTrigger>
              <TabsTrigger value="recovery">Recovery Code</TabsTrigger>
            </TabsList>

            {/* TOTP Tab */}
            <TabsContent value="totp" className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enter 6-Digit Code
                </label>
                <div className="flex gap-2 justify-between">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <motion.input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      pattern="[0-9]"
                      placeholder="0"
                      value={totpForm.getValues('code')[index] || ''}
                      onChange={(e) => handleTOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleTOTPBackspace(index, e)}
                      disabled={isLoading}
                      className={`
                        w-12 h-14 text-center text-lg font-bold
                        border-2 rounded-lg transition-all
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${
                          shakeAnimation
                            ? 'border-red-500 ring-2 ring-red-200'
                            : 'border-gray-300'
                        }
                        ${
                          successAnimation
                            ? 'border-green-500 ring-2 ring-green-200'
                            : ''
                        }
                      `}
                      animate={
                        shakeAnimation
                          ? { x: [-10, 10, -10, 10, 0] }
                          : successAnimation
                            ? { scale: 1.1, backgroundColor: '#dcfce7' }
                            : {}
                      }
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              {/* Trust Device Checkbox */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="trustDevice"
                  checked={totpForm.watch('rememberDevice')}
                  onCheckedChange={(checked) =>
                    totpForm.setValue('rememberDevice', !!checked)
                  }
                  disabled={isLoading}
                />
                <label
                  htmlFor="trustDevice"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Trust this device for 12 hours
                </label>
              </div>

              <p className="text-xs text-gray-500">
                ℹ️ Checking this box will skip MFA verification on this device
                until the session expires.
              </p>

              {/* Submit Button */}
              <Button
                onClick={() => {
                  const code = totpForm.getValues('code');
                  if (code.length === 6) {
                    handleTOTPSubmit(code);
                  } else {
                    setVerifyError('Please enter all 6 digits');
                  }
                }}
                disabled={isLoading || totpForm.getValues('code').length < 6}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
            </TabsContent>

            {/* Recovery Code Tab */}
            <TabsContent value="recovery" className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Recovery Code
                </label>
                <Input
                  placeholder="XXXX-XXXX-XXXX"
                  {...recoveryForm.register('recoveryCode')}
                  disabled={isLoading}
                  className="font-mono"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Use one of your 12-character recovery codes
                </p>
              </div>

              <Button
                onClick={() => recoveryForm.handleSubmit(handleRecoveryCodeSubmit)()}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Verifying...' : 'Verify Recovery Code'}
              </Button>
            </TabsContent>
          </Tabs>

          {/* Cancel & Help */}
          <div className="flex gap-2 mt-6 pt-6 border-t">
            {onCancel && (
              <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button variant="ghost" className="ml-auto text-sm">
              Need help?
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t text-xs text-gray-600">
          🔒 Your authentication is encrypted and secure
        </div>
      </motion.div>
    </div>
  );
};

// ============================================
// RECOVERY CODE MANAGEMENT COMPONENT
// ============================================

interface RecoveryCodeManagerProps {
  codes: string[];
  isNew?: boolean;
  onDownload?: (codes: string[]) => void;
}

export const RecoveryCodeManager: React.FC<RecoveryCodeManagerProps> = ({
  codes,
  isNew = false,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printContent = `
      HORIZON BORDER SUITE
      EMERGENCY RECOVERY CODES
      Generated: ${new Date().toLocaleString()}
      
      Keep these codes in a secure location
      ${codes.map((code, i) => `${(i + 1).toString().padStart(2, '0')}. ${code}`).join('\n')}
      
      Each code can be used ONCE if you lose access to your authenticator.
      After using a code, it is automatically invalidated.
      
      WARNING: Anyone with these codes can access your account.
    `;

    const printWindow = window.open('', '', 'width=600,height=400');
    if (printWindow) {
      printWindow.document.write(`<pre>${printContent}</pre>`);
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const content = `Horizon Border Suite - Recovery Codes\nGenerated: ${new Date().toLocaleString()}\n\n${codes.map((c, i) => `${(i + 1).toString().padStart(2, '0')}. ${c}`).join('\n')}`;

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', 'recovery-codes.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    onDownload?.(codes);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Emergency Recovery Codes
        </h2>
        <p className="text-gray-600 mb-6">
          Save these codes in a secure location. You can use each code once if
          you lose access to your authenticator app.
        </p>

        {isNew && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle>Save Your Codes Now</AlertTitle>
            <AlertDescription className="text-yellow-700">
              You won't be able to see these codes again. Keep them somewhere
              safe.
            </AlertDescription>
          </Alert>
        )}

        {/* Codes Display */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6 font-mono text-sm">
          {codes.map((code, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-300 last:border-b-0"
            >
              <span className="text-gray-500">{(index + 1).toString().padStart(2, '0')}.</span>
              <span className="tracking-widest">{code}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="flex-1 gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Codes
              </>
            )}
          </Button>

          <Button onClick={handlePrint} variant="outline" className="flex-1">
            Print Securely
          </Button>

          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1 gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>

        {/* Warning */}
        <Alert className="mt-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle>Keep Codes Private</AlertTitle>
          <AlertDescription className="text-red-700">
            Do not share these codes with anyone. Anyone with access to these
            codes can bypass MFA on your account.
          </AlertDescription>
        </Alert>
      </motion.div>
    </div>
  );
};

export default MFAVerification;

