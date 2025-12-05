import { ReactNode } from "react";
import { motion } from "motion/react";
import { Check, Circle } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}

interface WizardStepsProps {
  steps: Step[];
  currentStep: number;
  onStepChange?: (step: number) => void;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  onSubmit?: () => void;
  nextLabel?: string;
  backLabel?: string;
  submitLabel?: string;
  className?: string;
}

export function WizardSteps({
  steps,
  currentStep,
  onStepChange,
  children,
  onNext,
  onBack,
  onSubmit,
  nextLabel = "Continue",
  backLabel = "Back",
  submitLabel = "Submit",
  className = ""
}: WizardStepsProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Progress Bar */}
      <div className="sticky top-16 z-40 bg-blue-lightest dark:bg-[#121212] pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl text-navy-dark dark:text-white">
              {steps[currentStep].title}
            </h2>
            {steps[currentStep].description && (
              <p className="text-sm text-navy-medium/60 dark:text-white/60 mt-1">
                {steps[currentStep].description}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-navy-medium dark:text-white/80">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className="text-xs text-navy-medium/60 dark:text-white/60">
              {Math.round(progress)}% Complete
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-blue-light/20 dark:bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-navy-medium via-blue-medium to-navy-dark dark:from-blue-500 dark:to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-6">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep;

            return (
              <button
                key={step.id}
                onClick={() => onStepChange?.(index)}
                disabled={isUpcoming}
                className={`flex flex-col items-center gap-2 flex-1 group ${
                  isUpcoming ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {/* Circle */}
                <div
                  className={`relative flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all ${
                    isCompleted
                      ? "bg-navy-medium dark:bg-blue-500 border-navy-medium dark:border-blue-500"
                      : isCurrent
                      ? "bg-white dark:bg-[#1E1E1E] border-navy-medium dark:border-blue-500"
                      : "bg-white dark:bg-[#1E1E1E] border-blue-light/30 dark:border-white/20"
                  } ${!isUpcoming && "group-hover:scale-110"}`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : isCurrent ? (
                    <motion.div
                      className="h-3 w-3 rounded-full bg-navy-medium dark:bg-blue-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  ) : (
                    <Circle className="h-3 w-3 text-blue-light dark:text-white/30" />
                  )}
                </div>

                {/* Label */}
                <div className="text-xs text-center hidden md:block">
                  <div
                    className={`font-medium ${
                      isCompleted || isCurrent
                        ? "text-navy-dark dark:text-white"
                        : "text-navy-medium/50 dark:text-white/40"
                    }`}
                  >
                    {step.title}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-5 h-0.5 w-full transition-all ${
                      index < currentStep
                        ? "bg-navy-medium dark:bg-blue-500"
                        : "bg-blue-light/20 dark:bg-white/10"
                    }`}
                    style={{ transform: "translateY(-50%)", zIndex: -1 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="mt-8"
      >
        <Card className="p-8 border-navy-medium/10 dark:border-white/10 shadow-sm bg-white dark:bg-[#1E1E1E]">
          {children}
        </Card>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6 gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isFirstStep}
          className="px-6"
        >
          {backLabel}
        </Button>

        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-8 rounded-full transition-all ${
                index <= currentStep
                  ? "bg-navy-medium dark:bg-blue-500"
                  : "bg-blue-light/20 dark:bg-white/10"
              }`}
            />
          ))}
        </div>

        {isLastStep ? (
          <Button
            onClick={onSubmit}
            className="px-8 bg-gradient-to-r from-navy-medium to-blue-medium hover:from-navy-dark hover:to-navy-medium dark:from-blue-500 dark:to-blue-600"
          >
            {submitLabel}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="px-8 bg-gradient-to-r from-navy-medium to-blue-medium hover:from-navy-dark hover:to-navy-medium dark:from-blue-500 dark:to-blue-600"
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
