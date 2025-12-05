import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Alert, AlertDescription } from "../ui/alert";
import { Label } from "../ui/label";
import { getAgeOfMajority, requiresNationalId } from "./CountrySelector";

interface DatePickerProps {
  value?: Date;
  onValueChange: (date: Date | undefined) => void;
  nationality?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  showAgeInfo?: boolean;
}

export function DatePicker({
  value,
  onValueChange,
  nationality,
  label = "Date of Birth",
  placeholder = "Select date",
  className = "",
  required = false,
  showAgeInfo = true
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate age from date
  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Get age-related information
  const getAgeInfo = () => {
    if (!value || !nationality || !showAgeInfo) return null;

    const age = calculateAge(value);
    const ageOfMajority = getAgeOfMajority(nationality);
    const needsId = requiresNationalId(nationality, age);

    return {
      age,
      ageOfMajority,
      isAdult: age >= ageOfMajority,
      needsId,
      isChild: age < ageOfMajority
    };
  };

  const ageInfo = getAgeInfo();

  // Date constraints based on reasonable limits
  const today = new Date();
  const maxDate = new Date(); // Today
  const minDate = new Date(today.getFullYear() - 120, 0, 1); // 120 years ago

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor="date-picker">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onValueChange(date);
              setIsOpen(false);
            }}
            disabled={(date) =>
              date > maxDate || date < minDate
            }
            initialFocus
            defaultMonth={value || new Date(today.getFullYear() - 25, today.getMonth())}
          />
        </PopoverContent>
      </Popover>

      {ageInfo && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Age: {ageInfo.age} years old</span>
            <span>•</span>
            <span className={ageInfo.isAdult ? "text-green-600" : "text-orange-600"}>
              {ageInfo.isAdult ? "Adult" : "Minor"}
            </span>
          </div>

          {!ageInfo.isAdult && (
            <Alert>
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Minor Application Requirements:</p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Parent/Guardian consent required</li>
                    <li>• Birth certificate may be used instead of national ID</li>
                    <li>• Adult becomes eligible at age {ageInfo.ageOfMajority}</li>
                    {nationality && (
                      <li>• Special provisions apply for {nationality} nationals</li>
                    )}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {ageInfo.isAdult && ageInfo.needsId && (
            <Alert>
              <AlertDescription>
                <p className="text-sm">
                  <strong>National ID required:</strong> As an adult citizen, you must provide a valid national identity document.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {ageInfo.isAdult && !ageInfo.needsId && nationality && (
            <Alert>
              <AlertDescription>
                <p className="text-sm">
                  <strong>Alternative documents accepted:</strong> National ID not mandatory for {nationality} nationals. Passport or other identity documents may be used.
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}

// Age validation utilities
export function validateAge(birthDate: Date, minAge?: number, maxAge?: number): { isValid: boolean; error?: string } {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  // Check if birthday has occurred this year
  const hasHadBirthdayThisYear = 
    today.getMonth() > birthDate.getMonth() || 
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  
  const actualAge = hasHadBirthdayThisYear ? age : age - 1;

  if (actualAge < 0) {
    return { isValid: false, error: "Date of birth cannot be in the future" };
  }

  if (actualAge > 120) {
    return { isValid: false, error: "Please enter a valid date of birth" };
  }

  if (minAge && actualAge < minAge) {
    return { isValid: false, error: `Minimum age requirement is ${minAge} years` };
  }

  if (maxAge && actualAge > maxAge) {
    return { isValid: false, error: `Maximum age limit is ${maxAge} years` };
  }

  return { isValid: true };
}

// Get document requirements based on age and nationality
export function getDocumentRequirements(birthDate: Date, nationality: string): {
  primaryDocument: string;
  alternativeDocuments: string[];
  parentalConsent: boolean;
  specialRequirements: string[];
} {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const ageOfMajority = getAgeOfMajority(nationality);
  const isAdult = age >= ageOfMajority;
  const needsId = requiresNationalId(nationality, age);

  if (isAdult) {
    return {
      primaryDocument: needsId ? "National ID" : "Passport",
      alternativeDocuments: needsId 
        ? ["Passport", "Driving License", "Voter ID"]
        : ["National ID", "Driving License", "Birth Certificate"],
      parentalConsent: false,
      specialRequirements: []
    };
  } else {
    return {
      primaryDocument: "Birth Certificate",
      alternativeDocuments: ["School ID", "Baptismal Certificate"],
      parentalConsent: true,
      specialRequirements: [
        "Parent or guardian must be present",
        "Parent/guardian ID required",
        "Consent form must be signed"
      ]
    };
  }
}

export { calculateAge } from "./AutoFillDocuments";