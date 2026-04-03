/**
 * Personnel Onboarding - Multi-Step Registration Form
 * Stepped form for requesting government employee access
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistrationSchema, type RegistrationFormData } from '@/lib/validation/auth.schema';
import { Agency, AGENCY_LABELS, Rank, RANK_LABELS } from '@/lib/rbac/roles';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

const STEPS = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Enter your legal name',
  },
  {
    id: 'credentials',
    title: 'Government Credentials',
    description: 'Verify your employee ID and work email',
  },
  {
    id: 'agency',
    title: 'Agency & Department',
    description: 'Select your agency and rank',
  },
  {
    id: 'supervisor',
    title: 'Supervisor Verification',
    description: 'Provide supervisor contact information',
  },
  {
    id: 'review',
    title: 'Review & Confirm',
    description: 'Review your application',
  },
];

interface PersonnelOnboardingProps {
  onSubmit?: (data: RegistrationFormData) => Promise<void>;
  isLoading?: boolean;
}

export const PersonnelOnboarding: React.FC<PersonnelOnboardingProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(RegistrationSchema),
    mode: 'onBlur',
  });

  const handleNext = async () => {
    // Validate current step before moving forward
    const stepFields = getStepFields(currentStep);
    const isStepValid = await form.trigger(stepFields as any);

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      setSubmitError(null);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setSubmitError(null);
  };

  const handleSubmit = async (data: RegistrationFormData) => {
    try {
      setSubmitError(null);
      if (onSubmit) {
        await onSubmit(data);
        setSubmitted(true);
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to submit application'
      );
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            Application Submitted
          </h2>
          <p className="text-green-700 mb-4">
            Your access request has been submitted for review. Your supervisor will receive
            a verification request at their email address.
          </p>
          <p className="text-sm text-green-600">
            Request ID: <span className="font-mono font-semibold">REQ-{Date.now()}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Personnel Onboarding</h1>
        </div>
        <p className="text-gray-600">
          Complete this form to request government access to the Horizon Border Suite
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {submitError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 0 && (
            <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
              <div>
                <h2 className="text-xl font-semibold mb-1">{STEPS[0].title}</h2>
                <p className="text-sm text-gray-600">{STEPS[0].description}</p>
              </div>

              <FormField
                control={form.control}
                name="fullLegalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Legal Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="border-gray-300"
                      />
                    </FormControl>
                    <FormDescription>
                      Must match your government ID exactly
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 2: Government Credentials */}
          {currentStep === 1 && (
            <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
              <div>
                <h2 className="text-xl font-semibold mb-1">{STEPS[1].title}</h2>
                <p className="text-sm text-gray-600">{STEPS[1].description}</p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Employee ID Format</AlertTitle>
                <AlertDescription>
                  Format: DEPT-YYYY-XXXXX (e.g., CUST-2024-00001)
                </AlertDescription>
              </Alert>

              <FormField
                control={form.control}
                name="governmentEmployeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Government Employee ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="CUST-2024-00001"
                        {...field}
                        className="border-gray-300 font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@customs.gov"
                        {...field}
                        className="border-gray-300"
                      />
                    </FormControl>
                    <FormDescription>
                      Only official government email addresses are accepted
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 3: Agency & Department */}
          {currentStep === 2 && (
            <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
              <div>
                <h2 className="text-xl font-semibold mb-1">{STEPS[2].title}</h2>
                <p className="text-sm text-gray-600">{STEPS[2].description}</p>
              </div>

              <FormField
                control={form.control}
                name="agency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Government Agency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Select your agency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(AGENCY_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rank / Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Select your rank" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(RANK_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Description (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Border Security Division"
                        {...field}
                        className="border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 4: Supervisor Verification */}
          {currentStep === 3 && (
            <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
              <div>
                <h2 className="text-xl font-semibold mb-1">{STEPS[3].title}</h2>
                <p className="text-sm text-gray-600">{STEPS[3].description}</p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Supervisor Notification</AlertTitle>
                <AlertDescription>
                  Your supervisor will receive an email requesting verification of your access
                  request. Access will be granted only after approval.
                </AlertDescription>
              </Alert>

              <FormField
                control={form.control}
                name="supervisorEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supervisor Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="supervisor@customs.gov"
                        {...field}
                        className="border-gray-300"
                      />
                    </FormControl>
                    <FormDescription>
                      Official work email of your direct supervisor
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 4 && (
            <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
              <div>
                <h2 className="text-xl font-semibold mb-1">{STEPS[4].title}</h2>
                <p className="text-sm text-gray-600">{STEPS[4].description}</p>
              </div>

              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Full Name</p>
                    <p className="text-gray-900">{form.getValues('fullLegalName')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Employee ID</p>
                    <p className="text-gray-900 font-mono">{form.getValues('governmentEmployeeId')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Work Email</p>
                    <p className="text-gray-900">{form.getValues('workEmail')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Agency</p>
                    <p className="text-gray-900">
                      {AGENCY_LABELS[form.getValues('agency') as Agency]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rank</p>
                    <p className="text-gray-900">
                      {RANK_LABELS[form.getValues('rank') as Rank]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Supervisor Email</p>
                    <p className="text-gray-900">{form.getValues('supervisorEmail')}</p>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important Notice</AlertTitle>
                <AlertDescription>
                  By submitting this application, you confirm that all information is accurate
                  and you authorize your supervisor to verify your access request.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isLoading}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

// Helper function to get fields for current step
function getStepFields(step: number): string[] {
  const fieldsByStep: Record<number, string[]> = {
    0: ['fullLegalName'],
    1: ['governmentEmployeeId', 'workEmail'],
    2: ['agency', 'rank'],
    3: ['supervisorEmail'],
    4: [], // Review step doesn't validate
  };
  return fieldsByStep[step] || [];
}

export default PersonnelOnboarding;

